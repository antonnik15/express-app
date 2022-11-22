import {body, validationResult} from "express-validator";
import {blogsQueryRepository} from "../repositories/blogs-repositories/blogs-query-repository";
import {NextFunction, Request, Response} from "express";

export const ValidationOfPostsInputParameters = [
    body("title").trim().isString().withMessage({
        "message": "title is not string",
        "field": "title"
    }).isLength({min: 1, max: 30}).withMessage({
        "message": "title length is more than 30 symbols",
        "field": "title"
    }), body("shortDescription").trim().isString().withMessage({
        "message": "shortDescription is not a string",
        "field": "shortDescription"
    }).isLength({min: 1, max: 100}).withMessage({
        "message": "shortDescription length is more than 100 symbols",
        "field": "shortDescription"
    }), body("content").trim().isString().withMessage({
        "message": "content is not a string",
        "field": "content"
    }).isLength({min: 1, max: 1000}).withMessage({
        "message": "content length is more than 100 symbols",
        "field": "content"
    })
]

export const CustomValidationOfPostInputParameters = body("blogId")
    .custom(async (id) => {
        const blog = await blogsQueryRepository.findBlogById(id)
        if (blog) {
            return true;
        } else {
            return Promise.reject({
                "message": "blogId is not exist in blogs",
                "field": "blogId"
            })
        }
    })


export const InputPostsValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({errorsMessages: errors.array().map(err => err.msg)})
    } else {
        next()
    }
}


