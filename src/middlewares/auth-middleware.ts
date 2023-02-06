import {NextFunction, Response, Request} from "express";
import {UsersQueryRepository} from "../repositories/users-repository/users-query-repository";
import {JwtService} from "../application/jwt-service";
import {inject, injectable} from "inversify";

@injectable()
export class AuthMiddleware {
    constructor(@inject('UsersQueryRepository') public usersQueryRepository: UsersQueryRepository,
                @inject('JwtService') public jwtService: JwtService) {
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

@injectable()
export class AuthMiddlewareForComments {
    constructor(@inject('UsersQueryRepository') public usersQueryRepository: UsersQueryRepository,
                @inject('JwtService') public jwtService: JwtService) {
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
