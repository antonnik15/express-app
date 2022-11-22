import { Request, Response, Router} from "express";
import {
    ValidationOfBlogsInputParameters,
    InputBlogsValidationResult
} from "../middlewares/input-blogs-validation-middlewares";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepository} from "../repositories/blogs-repositories/blogs-query-repository";
import {postsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {postsService} from "../domain/posts-service";
import {
    InputPostsValidationResult,
    ValidationOfPostsInputParameters
} from "../middlewares/input-posts-validation-middlewares";


export const blogsRouter = Router({})

blogsRouter.get("/", async (req: Request, res: Response) => {
    const query = req.query;
    res.sendStatus(200).send(await blogsQueryRepository.findAllBlogs(query))
})

blogsRouter.post("/",
    BasicAuthorization,
    ValidationOfBlogsInputParameters,
    InputBlogsValidationResult,
    async (req: Request, res: Response) => {
        const createdBlogId = await blogsService.createNewBlogs(
            req.body.name,
            req.body.description,
            req.body.websiteUrl)

        res.sendStatus(201).send(await blogsQueryRepository.findBlogById(createdBlogId))
    })

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogsQueryRepository.findBlogById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
    }
    res.sendStatus(404)
})

blogsRouter.put('/:id',
    BasicAuthorization,
    ValidationOfBlogsInputParameters,
    InputBlogsValidationResult,
    async (req: Request, res: Response) => {
        const resultOfChange = await blogsService.updateBlogById(req.params.id,
            req.body.name,
            req.body.description,
            req.body.websiteUrl)

        if (resultOfChange) {
            res.sendStatus(204)
        }
        res.sendStatus(404)
    })

blogsRouter.delete('/:id',
    BasicAuthorization,
    async (req: Request, res: Response) => {
        const deletionResult = await blogsService.deleteBlogsById(req.params.id)
        if (deletionResult) {
            res.sendStatus(204)
        }
        res.sendStatus(404)

    })

blogsRouter.post("/:blogId/posts",
    BasicAuthorization,
    ValidationOfPostsInputParameters,
    InputPostsValidationResult,
    async (req: Request, res: Response) => {
        const blog = await blogsQueryRepository.findBlogById(req.params.blogId);
        if (blog) {
            const idOfCreatedPost = await postsService.createPost(req.body.title,
                req.body.shortDescription,
                req.body.content,
                req.params.blogId)
            res.status(201).send(await postsQueryRepository.findPostById(idOfCreatedPost))
        }
        res.sendStatus(404)
    })

blogsRouter.get("/:blogId/posts",
    async (req: Request, res: Response) => {
        const blog = await blogsQueryRepository.findBlogById(req.params.blogId);
        if (blog) {
            const query = req.query;
            res.status(200).send(await postsQueryRepository.findPostsForCertainBlog(req.params.blogId, query))
        }
        res.sendStatus(404)
    })