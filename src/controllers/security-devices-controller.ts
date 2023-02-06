import {JwtService} from "../application/jwt-service";
import {
    SecurityDevicesQueryRepository
} from "../repositories/security-devices-repositories/security-devices-query-repository";
import {SecurityDevicesRepository} from "../repositories/security-devices-repositories/security-devices-repository";
import {Request, Response} from "express";
import {injectable, inject} from "inversify";

@injectable()
export class SecurityDevicesController {
    constructor(@inject('JwtService') public jwtService: JwtService,
                @inject('SecurityDevicesQueryRepository') public securityDevicesQueryRepository: SecurityDevicesQueryRepository,
                @inject('SecurityDevicesRepository') public securityDevicesRepository: SecurityDevicesRepository) {
    }

    async getActiveSessions(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const jwtPayload = this.jwtService.getJWTPayload(refreshToken);
        if (!refreshToken || !jwtPayload) {
            res.sendStatus(401);
            return;
        }
        const authSessions = await this.securityDevicesQueryRepository.findUserAuthSessions(jwtPayload.userId)
        res.status(200).send(authSessions)
    }

    async deleteActiveSessions(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const jwtPayload = this.jwtService.getJWTPayload(refreshToken);
        if (!refreshToken || !jwtPayload) {
            res.sendStatus(401);
            return;
        }
        await this.securityDevicesRepository.terminateAllAuthSessionsForCurrentUser(jwtPayload);
        res.sendStatus(204);
        return;
    }

    async deleteActiveSessionByDeviceId(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const jwtPayload = this.jwtService.getJWTPayload(refreshToken);
        if (!refreshToken || !jwtPayload) {
            res.sendStatus(401);
            return;
        }
        const session = await this.securityDevicesQueryRepository.findSessionByDeviceId(req.params.deviceId);
        if (!session) {
            res.sendStatus(404);
            return;
        }
        if (session.userId !== jwtPayload.userId) {
            res.sendStatus(403);
            return;
        }
        await this.securityDevicesRepository.terminateCurrentSessionByDeviceId(jwtPayload.userId, req.params.deviceId);
        res.sendStatus(204)
        return;
    }
}