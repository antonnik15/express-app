import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {
    inputPostsValidationMiddlewares,
    isValidBlogId
} from "../middlewares/input-posts-validation-middlewares";
import {BasicAuthorization} from "../middlewares/authorization";
import {InputValidationMiddleware} from "../middlewares/input-blogs-validation-middlewares";

export const postsRouter = Router()

postsRouter.get("/", async (req: Request, res: Response) => {
    res.status(200).send(await postsRepository.getAllPosts())
})

postsRouter.post("/",
    BasicAuthorization,
    isValidBlogId,
    inputPostsValidationMiddlewares,
    InputValidationMiddleware,
    async (req: Request, res: Response) => {
    res.status(201).send(await postsRepository.createPost(req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId))
})

postsRouter.get("/:id", async (req: Request, res: Response) => {
    const post = await postsRepository.findPostById(req.body.params)
    if (post) {
        res.status(200).send(post)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.put("/:id",
    BasicAuthorization,
    inputPostsValidationMiddlewares,
    InputValidationMiddleware,
    async (req: Request, res: Response) => {
    const resultOfUpdating = await postsRepository.updatePost(req.params.id, req.body.title,
        req.body.shortDescription, req.body.content, req.body.blogId)
    if (resultOfUpdating) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.delete("/:id",
    BasicAuthorization,
    async (req: Request, res: Response) => {
    const resultOfDelete = await postsRepository.deletePostById(req.params.id)
    if (resultOfDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})