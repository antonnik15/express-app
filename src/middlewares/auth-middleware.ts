import {NextFunction, Response, Request} from "express";
import {UsersQueryRepository} from "../repositories/users-repositories/users-query-repository";
import {JwtService} from "../application/jwt-service";

export class AuthMiddleware {
    constructor(public usersQueryRepository: UsersQueryRepository,
                public jwtService: JwtService) {
    }
    async verificationUserByAccessToken(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            res.sendStatus(401)
            return;
        }
        const token = req.headers.authorization.split(" ")[1];
        const userId = await this.jwtService.getUserIdByToken(token)
        if (userId) {
            req.user = await this.usersQueryRepository.findUserById(userId);
            next()
            return;
        }
        res.sendStatus(401)
    }
}

export class AuthMiddlewareForComments {
    constructor(public usersQueryRepository: UsersQueryRepository,
                public jwtService: JwtService) {
    }
    async verificationUserByAccessToken(req: Request, res: Response, next: NextFunction) {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const userId = await this.jwtService.getUserIdByToken(token); if (userId) {
                req.user = await this.usersQueryRepository.findUserById(userId);
                next()
                return;
            }
        }
        next();
        return;
    }
}
