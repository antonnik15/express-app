import {NextFunction, Request, Response} from "express";
import {attemptsCollection} from "../repositories/db";

const timeInterval = 10 * 1000;

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const url = req.url;
    const attemptBody = await attemptsCollection.findOne({ipAddress: ip, url: url})
    if (!attemptBody) {
        const newAttempt = {
            ipAddress: ip,
            url: url,
            issuedAt: +new Date(),
            attemptsCount: 1
        }
        await attemptsCollection.insertOne(newAttempt);
        next();
        return;
    }
    if (+new Date() - attemptBody.issuedAt > timeInterval) {
        await attemptsCollection.updateOne({ipAddress: ip, url: url}, {$set: {issuedAt: +new Date(), attemptsCount: 1}})
        next();
        return;
    }
    if (attemptBody.attemptsCount >= 5) {
        res.sendStatus(429);
        return;
    }
    await attemptsCollection.updateOne({ipAddress: ip, url: url}, {$set: {attemptsCount: attemptBody.attemptsCount + 1}})
    next();
}