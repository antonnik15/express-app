import {Request, Response, Router} from "express";
import {
    inputPostsValidationMiddlewares, inputPostsValidationResult,
} from "../middlewares/input-posts-validation-middlewares";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {QueryObjectType} from "../repositories/blogs-repositories/blogs-query-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {
    inputCommentsValidationMiddleware, inputCommentsValidationResult
} from "../middlewares/input-comments-validation-middlewares";
import {CommentsType} from "../repositories/db";
import {SortDirection} from "mongodb";


export const postsRouter = Router()

postsRouter.get("/", async (req: Request, res: Response) => {
    const queryParams: QueryObjectType = postsService.createQueryBlogsObject(req.query)
    res.status(200).send(await postsQueryRepository.findAllPosts(queryParams))
})

postsRouter.post("/",
    BasicAuthorization,
    inputPostsValidationMiddlewares,
    inputPostsValidationResult,
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
    inputPostsValidationResult,
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

postsRouter.post("/:postId/comments",
    authMiddleware,
    inputCommentsValidationMiddleware,
    inputCommentsValidationResult,
    async (req: Request, res: Response) => {
        if (await postsQueryRepository.findPostById(req.params.postId)) {
            const newComment: CommentsType = await postsService.createCommentForPost(req.params.postId, req.body.content, req.user!);
            res.sendStatus(201).send(newComment);
        }
        res.sendStatus(404)
    })

postsRouter.get("/:postId/comments", async (req: Request, res: Response) => {
    const query = req.query;
    const queryObj = {
        pageNumber: (query.pageNumber) ? query.pageNumber as string : '1',
        pageSize: (query.pageSize) ? query.pageSize as string : '10',
        sortBy: (query.sortBy) ? query.sortBy as string : 'createdAt',
        sortDirection: (query.sortDirection) ? query.sortDirection as SortDirection : 'desc'
    };
    const outputObject = await postsQueryRepository.findCommentsForCertainPost(req.params.postId, queryObj)
    if (outputObject) res.sendStatus(200).send(outputObject);
    else res.sendStatus(404);
})

