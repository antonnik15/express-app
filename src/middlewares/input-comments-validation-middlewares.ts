import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";


export const ValidationOfCommentsInputParameters = [
    body("content").isString().withMessage({
        "message": "field content is not a string",
        "field": "content"
    }).isLength({min: 20, max: 300}).withMessage({
        "message": "Length of content more than 15 or less than 1 symbol",
        "field": "content"
    }),
    body('likeStatus').custom((likeStatus) => {
        console.log(likeStatus)
        if (!["Like", "Dislike", "None"].includes(likeStatus)){
            return Promise.reject({
                "message": "likeStatus incorrect",
                "field": "likeStatus"
            })
        }
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