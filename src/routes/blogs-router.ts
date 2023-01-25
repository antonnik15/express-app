import {Router} from "express";
import {
    InputBlogsValidationResult,
    ValidationOfBlogsInputParameters
} from "../middlewares/input-blogs-validation-middlewares";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {
    InputPostsValidationResult,
    ValidationOfPostsInputParameters
} from "../middlewares/input-posts-validation-middlewares";
import {blogsController} from "../application/composition-root";


export const blogsRouter = Router({})

blogsRouter.get("/", blogsController.getBlogs.bind(blogsController))

blogsRouter.post("/",
    BasicAuthorization,
    ValidationOfBlogsInputParameters,
    InputBlogsValidationResult,
    blogsController.createBlog.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogsRouter.put('/:id',
    BasicAuthorization,
    ValidationOfBlogsInputParameters,
    InputBlogsValidationResult,
    blogsController.updateBlogById.bind(blogsController))

blogsRouter.delete('/:id',
    BasicAuthorization,
    blogsController.deleteBlogById.bind(blogsController))

blogsRouter.post("/:blogId/posts",
    BasicAuthorization,
    ValidationOfPostsInputParameters,
    InputPostsValidationResult,
    blogsController.createPostForCertainBlog.bind(blogsController))

blogsRouter.get("/:blogId/posts",
    blogsController.getPostForCertainBlog.bind(blogsController))