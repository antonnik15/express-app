import {NextFunction, Request, Response} from "express";
import {Buffer} from "buffer";

const credentials = {
    login: "admin",
    password: "qwerty"
}

export const BasicAuthorization = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const encodedAuth = Buffer.from(`${credentials.login}:${credentials.password}`).toString('base64')
    const validHeader = `Basic ${encodedAuth}`
    if (authHeader === validHeader) {
        next()
    } else {
        res.sendStatus(401);
    }
}


