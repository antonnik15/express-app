import {body, validationResult} from "express-validator";
import {NextFunction, Response, Request} from "express";

export const InputBlogsValidationMiddlewares = [body("youtubeUrl").trim()
    .isLength({min: 1, max: 100}).withMessage({
        "message": "Length of youtubeUrl more than 100 or less than 1 symbol",
        "field": "youtubeUrl"
    }).isString().withMessage({
        "message": "field youtubeUrl is not a string",
        "field": "youtubeUrl"
    }).matches(new RegExp("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$"))
    .withMessage({
        "message": "field youtubeUrl is not valid",
        "field": "youtubeUrl"
    }), body("name").trim()
    .isLength({min: 1, max: 15}).withMessage({
        "message": "Length of name more than 15 or less than 1 symbol",
        "field": "name"
    }).isString().withMessage({
        "message": "field name is not a string",
        "field": "name"
    })]

export const InputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({errorsMessages: errors.array().map(m => m.msg)})
    } else {
        next()
    }
}