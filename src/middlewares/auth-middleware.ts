import {NextFunction, Response, Request} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/users-repositories/users-query-repository";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersQueryRepository.findUserById(userId)
        next()
        return;
    }
    res.sendStatus(401)
}