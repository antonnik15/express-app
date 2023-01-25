import {Router} from "express";
import {
    CustomValidationOfPostInputParameters,
    InputPostsValidationResult,
    ValidationOfPostsInputParameters,
} from "../middlewares/input-posts-validation-middlewares";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {
    inputCommentsValidationResult,
    ValidationOfCommentsInputParameters
} from "../middlewares/input-comments-validation-middlewares";
import {authMiddleware, postsController} from "../application/composition-root";


export const postsRouter = Router()

postsRouter.get("/", postsController.getPosts.bind(postsController))

postsRouter.post("/",
    BasicAuthorization,
    ValidationOfPostsInputParameters,
    CustomValidationOfPostInputParameters,
    InputPostsValidationResult,
    postsController.createPost.bind(postsController))

postsRouter.get("/:id", postsController.getPostById.bind(postsController))

postsRouter.put("/:id",
    BasicAuthorization,
    ValidationOfPostsInputParameters,
    CustomValidationOfPostInputParameters,
    InputPostsValidationResult,
    postsController.updatePostById.bind(postsController))

postsRouter.delete("/:id",
    BasicAuthorization,
    postsController.deletePostById.bind(postsController))

postsRouter.post("/:postId/comments",
    authMiddleware.verificationUserByAccessToken.bind(authMiddleware),
    ValidationOfCommentsInputParameters,
    inputCommentsValidationResult,
    postsController.createCommentForCertainPost.bind(postsController))

postsRouter.get("/:postId/comments", postsController.getCommentForCertainPost.bind(postsController))

