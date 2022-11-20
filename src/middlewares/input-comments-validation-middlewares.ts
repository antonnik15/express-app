import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";


export const inputCommentsValidationMiddleware = [
    body("content").isString().withMessage({
        "message": "field content is not a string",
        "field": "content"
    }).isLength({min: 20, max: 300}).withMessage({
        "message": "Length of content more than 15 or less than 1 symbol",
        "field": "content"
    })
];

export const inputCommentsValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({errorsMessages: errors.array().map(err => err.msg)})
    } else {
        next()
    }
}