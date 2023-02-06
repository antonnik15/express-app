import {AuthService} from "../domain/auth-service";
import {UsersService} from "../domain/users-service";
import {JwtService} from "../application/jwt-service";
import {AuthMiddleware} from "../middlewares/auth-middleware";
import {Request, Response} from "express";
import UAParser from "ua-parser-js";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {
    constructor(@inject('AuthService') public authService: AuthService,
                @inject('UsersService') public usersService: UsersService,
                @inject('JwtService') public jwtService: JwtService,
                @inject('AuthMiddleware') public authMiddleware: AuthMiddleware) {
    }

    async registration(req: Request, res: Response) {
        const userId = await this.authService.createNewUser(req.body.login, req.body.password, req.body.email);
        if (userId) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(400)
    }

    async confirmationRegistration(req: Request, res: Response) {
        const confirmationResult = await this.authService.confirmEmail(req.body.code, req.body.email);
        if (confirmationResult) {
            res.sendStatus(204)
            return;
        }
        res.status(400).send({errorsMessages: [{message: "some problem with code confirmation", field: "code"}]})
    }

    async resendEmailConfirmation(req: Request, res: Response) {
        const resultOfSending = await this.authService.resendEmailConfirmationMessage(req.body.email);
        if (resultOfSending) {
            res.sendStatus(204)
            return;
        }
        res.status(400).send({
            errorsMessages: [{
                message: "this user was confirmed, or some problem with email",
                field: "email"
            }]
        });
    }

    async login(req: Request, res: Response) {
        const user = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (user) {
            const accessToken: string = await this.jwtService.createAccessToken(user.id);
            const refreshToken: string = await this.jwtService.createRefreshToken(user.id);

            const deviceInfo = UAParser(req.headers["user-agent"]);
            const ipAddress: string = req.ip;

            await this.authService.createDeviceAuthSession(refreshToken, deviceInfo, ipAddress);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true
            });
            res.status(200).send({accessToken: accessToken});
            return;
        }
        res.sendStatus(401)
    }

    async getNewRefreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(401);
            return;
        }
        const jwtPayload = await this.authService.checkRefreshToken(refreshToken);
        if (jwtPayload) {
            const accessToken: string = await this.jwtService.createAccessToken(jwtPayload.userId);
            const newRefreshToken: string = await this.jwtService.createRefreshToken(jwtPayload.userId, jwtPayload.deviceId);

            await this.authService.updateCurrentAuthSession(newRefreshToken);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true
            });
            res.status(200).send({accessToken: accessToken});
            return;
        }
        res.sendStatus(401)
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const jwtPayload = await this.authService.checkRefreshToken(refreshToken);
        if (jwtPayload) {
            await this.authService.deleteCurrentAuthSession(jwtPayload);
            res.clearCookie('refreshToken');
            res.sendStatus(204);
            return;
        }
        res.sendStatus(401);
    }

    async getInfoAboutCurrentUser(req: Request, res: Response) {
        res.status(200).send({
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        })
    }

    async recoveryPassword(req: Request, res: Response) {
        await this.authService.sendRecoveryCode(req.body.email);
        res.sendStatus(204);
    }

    async changePassword(req: Request, res: Response) {
        const recoveryPasswordResult = await this.authService.recoveryPassword(req.body.newPassword, req.body.recoveryCode);
        if (recoveryPasswordResult) {
            res.sendStatus(204)
            return;
        }
        res.status(400).send({errorsMessages: [{message: "recoveryCode is incorrect", field: "recoveryCode"}]});
    }
}