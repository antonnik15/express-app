import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {
    InputBlogsValidationMiddlewares,
    InputValidationMiddleware
} from "../middlewares/input-blogs-validation-middlewares";
import {BasicAuthorization} from "../middlewares/authorization";


export const blogsRouter = Router({})

blogsRouter.get("/", async (req: Request, res: Response) => {
    res.send(await blogsRepository.getAllBlogs())
})

blogsRouter.post("/",
    BasicAuthorization,
    InputBlogsValidationMiddlewares,
    InputValidationMiddleware,
    async (req: Request, res: Response) => {
    res.send(await blogsRepository.createNewBlogs(req.body.name, req.body.youtubeUrl))
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogsRepository.findBlogById(req.params.id)
    if (blog) {
        res.status(201).send(blog)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.put('/:id',
    BasicAuthorization,
    InputBlogsValidationMiddlewares,
    InputValidationMiddleware,
    async (req: Request, res: Response) => {
    const result = await blogsRepository.updateBlogById(req.params.id, req.body.name, req.body.youtubeUrl)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.delete('/:id',
    BasicAuthorization,
    async (req: Request, res: Response) => {
    const resultOfDelete = await blogsRepository.deleteBlogsById(req.params.id)
    if (resultOfDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

