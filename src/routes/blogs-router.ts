import { Request, Response, Router} from "express";
import {
    InputBlogsValidationMiddlewares,
    InputBlogsValidationResult
} from "../middlewares/input-blogs-validation-middlewares";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepository, QueryObjectType} from "../repositories/blogs-repositories/blogs-query-repository";
import {
    inputPostsValidationMiddlewaresForCreatingCertain
} from "../middlewares/input-posts-validation-middlewares";
import {postsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {postsService} from "../domain/posts-service";


export const blogsRouter = Router({})

blogsRouter.get("/", async (req: Request, res: Response) => {
    const queryObjectParams: QueryObjectType = blogsService.createQueryBlogsObject(req.query)
    res.send(await blogsQueryRepository.findAllBlogs(queryObjectParams))
})

blogsRouter.post("/",
    BasicAuthorization,
    InputBlogsValidationMiddlewares,
    InputBlogsValidationResult,
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
    InputBlogsValidationResult,
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
    InputBlogsValidationResult,
    async (req: Request, res: Response) => {
        if (await blogsQueryRepository.findBlogById(req.params.blogId)) {
            const createdPostForSpecificBlog = await postsService.createPost(req.body.title,
                req.body.shortDescription, req.body.content, req.params.blogId)
            res.status(201).send(await postsQueryRepository.findPostById(createdPostForSpecificBlog))
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.get("/:blogId/posts", async (req: Request, res: Response) => {
    if(await blogsQueryRepository.findBlogById(req.params.blogId)) {
        const queryObjectParams: QueryObjectType = blogsService.createQueryBlogsObject(req.query)
        res.status(200).send(await postsQueryRepository.findPostsForCertainBlog(req.params.blogId, queryObjectParams))
    } else {
        res.sendStatus(404)
    }
})