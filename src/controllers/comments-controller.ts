import {CommentsQueryRepository} from "../repositories/comments-repositories/comments-query-repository";
import {CommentsService} from "../domain/comments-service";
import {AuthMiddleware} from "../middlewares/auth-middleware";
import {Request, Response} from "express";

export class CommentsController {
    constructor(
        public commentsQueryRepository: CommentsQueryRepository,
        public commentsService: CommentsService,
        public authMiddleware: AuthMiddleware) {
    }

    async getCommentById(req: Request, res: Response) {
        const comment = await this.commentsQueryRepository.findCommentById(req.params.id, req.user?.id)
        if (comment) {
            res.status(200).send(comment)
            return;
        }
        res.sendStatus(404);
    }

    async updateCommentById(req: Request, res: Response) {
        const comment = await this.commentsQueryRepository.findCommentById(req.params.commentId, req.user)
        if (!comment) {
            res.sendStatus(404)
            return;
        }
        if (comment.commentatorInfo.userId === req.user!.id) {
            const resultOfChange = await this.commentsService.updateCommentById(req.params.commentId, req.body.content)
            if (resultOfChange) {
                res.sendStatus(204);
                return;
            }
        }
        res.sendStatus(403)
    }

    async deleteCommentById(req: Request, res: Response) {
        const comment = await this.commentsQueryRepository.findCommentById(req.params.commentId, req.user)
        if (!comment) {
            res.sendStatus(404)
            return;
        }
        if (comment.commentatorInfo.userId === req.user!.id) {
            const deletionResult = await this.commentsService.deleteCommentById(req.params.commentId)
            if (deletionResult) {
                res.sendStatus(204)
                return;
            }
        }
        res.sendStatus(403)
    }

    async likeOrDislikeComment(req: Request, res: Response) {
        const comment = await this.commentsQueryRepository.findCommentById(req.params.commentId, req.user);
        if (!comment) {
            res.sendStatus(404);
            return;
        }
        await this.commentsService.addLikeOrDislike(req.params.commentId, req.body.likeStatus, req.user.id)
        res.sendStatus(204)
    }

}