import {Router} from "express";
import {
    inputCommentsValidationResult,
    ValidationOfCommentsInputParameters
} from "../middlewares/input-comments-validation-middlewares";
import {authMiddleware, commentsController} from "../application/composition-root";


export const commentsRouter = Router({})

commentsRouter.get("/:id", commentsController.getCommentById.bind(commentsController))

commentsRouter.put("/:commentId",
    authMiddleware.verificationUserByAccessToken.bind(authMiddleware),
    ValidationOfCommentsInputParameters,
    inputCommentsValidationResult,
    commentsController.updateCommentById.bind(commentsController))

commentsRouter.delete("/:commentId",
    authMiddleware.verificationUserByAccessToken.bind(authMiddleware),
    commentsController.deleteCommentById.bind(commentsController))

commentsRouter.put('/:commentId/like-status',
    ValidationOfCommentsInputParameters[1],
    inputCommentsValidationResult,
    authMiddleware.verificationUserByAccessToken.bind(authMiddleware),
    commentsController.likeOrDislikeComment.bind(commentsController))

