import {Response, Request, Router} from "express";
import {commentsQueryRepository} from "../repositories/comments-repositories/comments-query-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentsService} from "../domain/comments-service";
import {
    inputCommentsValidationResult, ValidationOfCommentsInputParameters
} from "../middlewares/input-comments-validation-middlewares";


export const commentsRouter = Router({})

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.id)
    if (comment) {
        res.send(200).send(comment)
        return;
    }
    res.sendStatus(404);
})

commentsRouter.put("/:commentId",
    authMiddleware,
    ValidationOfCommentsInputParameters,
    inputCommentsValidationResult,
    async (req: Request, res: Response) => {
        const comment = await commentsQueryRepository.findCommentById(req.params.commentId)
        if (!comment) {
            res.sendStatus(404)
            return;
        }
        if (comment.userId === req.user!.id) {
            const resultOfChange = await commentsService.updateCommentById(req.params.commentId, req.body.content)
            if (resultOfChange) {
                res.sendStatus(204);
                return;
            }
        }
        res.sendStatus(403)
})

commentsRouter.delete("/:commentId",
    authMiddleware,
    async (req: Request, res: Response) => {
        const comment = await commentsQueryRepository.findCommentById(req.params.commentId)
        if (!comment) {
            res.sendStatus(404)
            return;
        }
        if (comment.userId === req.user!.id) {
            const deletionResult = await commentsService.deleteCommentById(req.params.id)
            if (deletionResult) {
                res.sendStatus(204)
                return;
            }
        }
        res.sendStatus(403)
})

