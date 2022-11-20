import {Response, Request, Router} from "express";
import {commentsQueryRepository} from "../repositories/comments-repositories/comments-query-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentsService} from "../domain/comments-service";
import {
    inputCommentsValidationMiddleware,
    inputCommentsValidationResult
} from "../middlewares/input-comments-validation-middlewares";


export const commentsRouter = Router({})

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.id)
    if (comment) {
        res.sendStatus(200).send(comment)
    }
    res.sendStatus(404);
})

commentsRouter.put("/:commentId",
    authMiddleware,
    inputCommentsValidationMiddleware,
    inputCommentsValidationResult,
    async (req: Request, res: Response) => {
        const comment = await commentsQueryRepository.findCommentById(req.params.commentId)
        if (!comment) return 404;
        if (comment.userId === req.user!.id) {
            if (await commentsService.updateCommentById(req.params.commentId, req.body.content)) {
                res.sendStatus(204);
            }
        }
        res.sendStatus(403)
})

commentsRouter.delete("/:commentId",
    authMiddleware,
    async (req: Request, res: Response) => {
        const comment = await commentsQueryRepository.findCommentById(req.params.id)
        if (!comment) res.sendStatus(404);
        if (comment!.userId === req.user!.id) {
            const resultOfDeleting = await commentsService.deleteCommentById(req.params.id)
            if (resultOfDeleting) {
                res.sendStatus(204)
            }
        }
        res.sendStatus(403)
})

