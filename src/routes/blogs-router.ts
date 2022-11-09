import {Request, Response, Router} from "express";
import {
    InputBlogsValidationMiddlewares,
    InputValidationMiddleware
} from "../middlewares/input-blogs-validation-middlewares";
import {BasicAuthorization} from "../middlewares/authorization";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepository} from "../repositories/blogs-repositories/blogs-query-repository";


export const blogsRouter = Router({})

blogsRouter.get("/", async (req: Request, res: Response) => {
    res.send(await blogsQueryRepository.findAllBlogs())
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

