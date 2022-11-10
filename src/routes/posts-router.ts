import {Request, Response, Router} from "express";
import {
    inputPostsValidationMiddlewares,
} from "../middlewares/input-posts-validation-middlewares";
import {BasicAuthorization} from "../middlewares/authorization";
import {InputValidationMiddleware} from "../middlewares/input-blogs-validation-middlewares";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {queryObj} from "../repositories/blogs-repositories/blogs-query-repository";


export const postsRouter = Router()

postsRouter.get("/", async (req: Request, res: Response) => {
    const query = req.query
    const queryParams: queryObj = {
        pageNumber: (query.pageNumber) ? +query.pageNumber : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy.toString() : "createdAt",
        sortDirection: (query.sortDirection === "asc") ? "asc" : "desc"
    }
    res.status(200).send(await postsQueryRepository.findAllPosts(queryParams))
})

postsRouter.post("/",
    BasicAuthorization,
    inputPostsValidationMiddlewares,
    InputValidationMiddleware,
    async (req: Request, res: Response) => {
    const postId = await postsService.createPost(req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId)
    res.status(201).send(await postsQueryRepository.findPostById(postId))
})

postsRouter.get("/:id", async (req: Request, res: Response) => {
    const post = await postsQueryRepository.findPostById(req.params.id)
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
    const resultOfUpdating = await postsService.updatePost(req.params.id, req.body.title,
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
    const resultOfDelete = await postsService.deletePostById(req.params.id)
    if (resultOfDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

