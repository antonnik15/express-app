import {Request, Response, Router} from "express";
import {
    CustomValidationOfPostInputParameters, InputPostsValidationResult,
    ValidationOfPostsInputParameters,
} from "../middlewares/input-posts-validation-middlewares";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {
    inputCommentsValidationResult
} from "../middlewares/input-comments-validation-middlewares";
import {CommentsType} from "../repositories/db";



export const postsRouter = Router()

postsRouter.get("/", async (req: Request, res: Response) => {
    const query = req.query;
    res.status(200).send(await postsQueryRepository.findAllPosts(query))
})

postsRouter.post("/",
    BasicAuthorization,
    ValidationOfPostsInputParameters,
    CustomValidationOfPostInputParameters,
    InputPostsValidationResult,
    async (req: Request, res: Response) => {
        const postId = await postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        res.status(201).send(await postsQueryRepository.findPostById(postId))
    })

postsRouter.get("/:id", async (req: Request, res: Response) => {
    const post = await postsQueryRepository.findPostById(req.params.id)
    if (post) {
        res.status(200).send(post)
        return;
    }
    res.sendStatus(404)
})

postsRouter.put("/:id",
    BasicAuthorization,
    ValidationOfPostsInputParameters,
    CustomValidationOfPostInputParameters,
    InputPostsValidationResult,
    async (req: Request, res: Response) => {
        const resultOfChange = await postsService.updatePostById(req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        if (resultOfChange) {
            res.sendStatus(204)
            return;
        }
        res.sendStatus(404)

})

postsRouter.delete("/:id",
    BasicAuthorization,
    async (req: Request, res: Response) => {
    const deletionResult = await postsService.deletePostById(req.params.id)
    if (deletionResult) {
        res.sendStatus(204)
        return;
    }
    res.sendStatus(404)

})

postsRouter.post("/:postId/comments",
    authMiddleware,
    ValidationOfPostsInputParameters,
    inputCommentsValidationResult,
    async (req: Request, res: Response) => {
        const post = await postsQueryRepository.findPostById(req.params.postId);
        if (post) {
            const newComment: CommentsType = await postsService.createNewCommentForPost(
                req.params.postId,
                req.body.content,
                req.user!);
            res.status(201).send(newComment);
            return;
        }
        res.sendStatus(404)
    })

postsRouter.get("/:postId/comments", async (req: Request, res: Response) => {
    const post = await postsQueryRepository.findPostById(req.params.postId);
    if (post) {
        const query = req.query;
        res.status(200).send(await postsQueryRepository.findCommentsForCertainPost(req.params.postId, query))
        return;
    }
    res.sendStatus(404);
})

