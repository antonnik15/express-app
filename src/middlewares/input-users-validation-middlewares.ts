import {body, validationResult} from "express-validator";
import {Response, Request, NextFunction} from "express";


export const inputUsersValidationMiddlewares = [
    body("login").trim().isString().withMessage({
        "message": "login is not a string",
        "field": "login"
    }).isLength({min: 3, max: 10}).withMessage({
        "message": "length of login more than 10 or less than 3 symbols",
        "field": "login"
    }), body('password').trim().isString().withMessage({
        "message": "password is not a string",
        "field": "password"
    }).isLength({min: 6, max: 20}).withMessage({
        "message": "length of password more than 20 or less than 6 symbols",
        "field": "password"
    }), body("email").isString().withMessage({
        "message": "email is not a string",
        "field": "email"
    }).matches(new RegExp("^[\\w-\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")).withMessage({
        "message": "email is not valid",
        "field": "email"
    })
]

export const inputUsersValidationMiddlewaresForCheckCredentials = [
    body("login").trim().isString().withMessage({
        "message": "login is not a string",
        "field": "login"
    }).isLength({min: 3, max: 10}).withMessage({
        "message": "length of login more than 10 or less than 3 symbols",
        "field": "login"
    }), body('password').trim().isString().withMessage({
        "message": "password is not a string",
        "field": "password"
    }).isLength({min: 6, max: 20}).withMessage({
        "message": "length of password more than 20 or less than 6 symbols",
        "field": "password"
    })
]

export const inputUsersValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({errorsMessages: errors.array().map(err => err.msg)})
    } else {
        next()
    }
}