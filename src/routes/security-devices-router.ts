import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {
    securityDevicesQueryRepository
} from "../repositories/security-devices-repositories/security-devices-query-repository";
import {securityDevicesRepository} from "../repositories/security-devices-repositories/security-devices-repository";


export const securityDevicesRouter = Router({});

securityDevicesRouter.get("/", async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const jwtPayload = jwtService.getJWTPayload(refreshToken);
    if (!refreshToken || !jwtPayload) {
        res.sendStatus(401);
        return;
    }
    const authSessions = await securityDevicesQueryRepository.findUserAuthSessions(jwtPayload.userId)
    res.status(200).send(authSessions)
})

securityDevicesRouter.delete("/", async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const jwtPayload = jwtService.getJWTPayload(refreshToken);
    if (!refreshToken || !jwtPayload) {
        res.sendStatus(401);
        return;
    }
    await securityDevicesRepository.terminateAllAuthSessionsForCurrentUser(jwtPayload.userId);
    res.sendStatus(204);
    return;
})

securityDevicesRouter.delete("/:deviceId", async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const jwtPayload = jwtService.getJWTPayload(refreshToken);
    if (!refreshToken || !jwtPayload) {
        res.sendStatus(401);
        return;
    }
    const session = await securityDevicesQueryRepository.findSessionByDeviceId(jwtPayload.deviceId);
    if (!session) {
        res.sendStatus(404);
        return;
    }
    if (session.userId !== jwtPayload.userId) {
        res.sendStatus(403);
        return;
    }
    await securityDevicesRepository.terminateCurrentSessionByDeviceId(jwtPayload.userId, req.params.deviceId);
    res.sendStatus(204)
    return;
})