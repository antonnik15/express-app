import {AuthModel} from "../mongoose/mongoose-schemes";
import {dbSessionsType, SessionType} from "../mongoose/types";
import {injectable} from "inversify";

@injectable()
export class SecurityDevicesQueryRepository {
    async findSessionByJWTPayload(jwtPayload: any) {
        const authSession: dbSessionsType | null = await AuthModel.findOne({
            userId: jwtPayload.userId,
            issuedAt: jwtPayload.iat,
            exp: jwtPayload.exp,
            deviceId: jwtPayload.deviceId
        });
        if (!authSession) return null;
        return authSession;
    }

    async findUserAuthSessions(userId: string): Promise<SessionType[]> {
        const dbAuthSessions: dbSessionsType[] = await AuthModel.find({userId: userId}).lean();
        return dbAuthSessions.map(sess => this._mapDbSessionsTypeToOutputSessionType(sess));
    }
    async findSessionByDeviceId(deviceId: string): Promise<dbSessionsType | null> {
        return AuthModel.findOne({deviceId: deviceId});
    }
    _mapDbSessionsTypeToOutputSessionType(session: dbSessionsType): SessionType {
        return new SessionType(
            session.ipAddress,
            session.deviceName.name,
            new Date(+session.issuedAt * 1000).toISOString(),
            session.deviceId)
    }
}

