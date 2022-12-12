import {RateLimiterMemory} from "rate-limiter-flexible";
import {NextFunction, Request, Response} from "express";

const MAX_REQUEST_LIMIT = 5;
const MAX_REQUEST_WINDOW = 10;

const rateLimiter = new RateLimiterMemory({
    duration: MAX_REQUEST_WINDOW,
    points: MAX_REQUEST_LIMIT
})

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    rateLimiter
        .consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.sendStatus(429);
            next()
        })
}