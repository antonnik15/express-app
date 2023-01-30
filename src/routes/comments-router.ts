import {Router} from "express";
import {
    inputCommentsValidationResult,
    ValidationOfCommentsInputParameters
} from "../middlewares/input-comments-validation-middlewares";
import {authMiddleware, authMiddlewareForComments, commentsController} from "../application/composition-root";


export const commentsRouter = Router({})

commentsRouter.get("/:id",
    authMiddlewareForComments.verificationUserByAccessToken.bind(authMiddleware),
    commentsController.getCommentById.bind(commentsController))

commentsRouter.put("/:commentId",
    authMiddleware.verificationUserByAccessToken.bind(authMiddleware),
    ValidationOfCommentsInputParameters[0],
    inputCommentsValidationResult,
    commentsController.updateCommentById.bind(commentsController))

commentsRouter.delete("/:commentId",
    authMiddleware.verificationUserByAccessToken.bind(authMiddleware),
    commentsController.deleteCommentById.bind(commentsController))

commentsRouter.put('/:commentId/like-status',
    authMiddleware.verificationUserByAccessToken.bind(authMiddleware),
    ValidationOfCommentsInputParameters[1],
    inputCommentsValidationResult,
    commentsController.likeOrDislikeComment.bind(commentsController))

