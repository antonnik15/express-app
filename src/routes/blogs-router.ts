import { Request, Response, Router} from "express";
import {
    InputBlogsValidationMiddlewares,
    InputValidationMiddleware
} from "../middlewares/input-blogs-validation-middlewares";
import {BasicAuthorization} from "../middlewares/authorization";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepository, queryObj} from "../repositories/blogs-repositories/blogs-query-repository";
import {
    inputPostsValidationMiddlewaresForCreatingCertain
} from "../middlewares/input-posts-validation-middlewares";
import {postsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {postsService} from "../domain/posts-service";


export const blogsRouter = Router({})

blogsRouter.get("/", async (req: Request, res: Response) => {
    const query = req.query;
    const queryParams: queryObj = {
        searchNameTerm: (query.searchNameTerm) ? new RegExp(query.searchNameTerm.toString()) : null,
        pageNumber: (query.pageNumber) ? +query.pageNumber : 1,
        pageSize: (query.pageSize) ? +query.pageSize : 10,
        sortBy: (query.sortBy) ? query.sortBy.toString() : "createdAt",
        sortDirection: (query.sortDirection) ? "desc" : "asc",
    }
    res.send(await blogsQueryRepository.findAllBlogs(queryParams))
})

blogsRouter.post("/",
    BasicAuthorization,
    InputBlogsValidationMiddlewares,
    InputValidationMiddleware,
    async (req: Request, res: Response) => {
    const blogId = await blogsService.createNewBlogs(req.body.name, req.body.youtubeUrl)
    res.status(201).send(await blogsQueryRepository.findBlogById(blogId))
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogsQueryRepository.findBlogById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.put('/:id',
    BasicAuthorization,
    InputBlogsValidationMiddlewares,
    InputValidationMiddleware,
    async (req: Request, res: Response) => {
    const result = await blogsService.updateBlogById(req.params.id, req.body.name, req.body.youtubeUrl)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.delete('/:id',
    BasicAuthorization,
    async (req: Request, res: Response) => {
    const resultOfDelete = await blogsService.deleteBlogsById(req.params.id)
    if (resultOfDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.post("/:blogId/posts",
    BasicAuthorization,
    inputPostsValidationMiddlewaresForCreatingCertain,
    InputValidationMiddleware,
    async (req: Request, res: Response) => {
        if (await blogsQueryRepository.findBlogById(req.params.blogId)) {
            const createdPostId = await postsService.createPostForCertainBlog(req.params.blogId, req.body.title,
                req.body.shortDescription, req.body.content)
            res.status(201).send(await postsQueryRepository.findPostById(createdPostId))
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.get("/:blogId/posts", async (req: Request, res: Response) => {
    if(await blogsQueryRepository.findBlogById(req.params.blogId)) {
        const query = req.query
        const queryParams: queryObj = {
            pageNumber: (query.pageNumber) ? +query.pageNumber : 1,
            pageSize: (query.pageSize) ? +query.pageSize : 10,
            sortBy: (query.sortBy) ? query.sortBy.toString() : "createdAt",
            sortDirection: (query.sortDirection == "desc") ? "desc" : "asc"
        }
        res.status(200).send(await postsQueryRepository.findPostsForCertainBlog(req.params.blogId, queryParams))
    } else {
        res.sendStatus(404)
    }
})