import {AuthModel} from "../mongoose/mongoose-schemes";
import {dbSessionsType, SessionType} from "../mongoose/types";

export const securityDevicesQueryRepository = {
    async findSessionByJWTPayload(jwtPayload: any) {
        const authSession: dbSessionsType | null = await AuthModel.findOne({
            userId: jwtPayload.userId,
            issuedAt: jwtPayload.iat,
            exp: jwtPayload.exp,
            deviceId: jwtPayload.deviceId
        });
        if (!authSession) return null;
        return authSession;
    },
    async findUserAuthSessions(userId: string) {
        const dbAuthSessions: dbSessionsType[] = await AuthModel.find({userId: userId}).lean();
        const authSessionsArray: SessionType[] = dbAuthSessions.map(sess => this._mapDbSessionsTypeToOutputSessionType(sess))
        return authSessionsArray;
    },
    async findSessionByDeviceId(deviceId: string): Promise<dbSessionsType | null> {
        return AuthModel.findOne({deviceId: deviceId});
    },
    _mapDbSessionsTypeToOutputSessionType(session: dbSessionsType): SessionType {
        return {
            ip: session.ipAddress,
            title: session.deviceName.name,
            lastActiveDate: new Date(+session.issuedAt * 1000).toISOString(),
            deviceId: session.deviceId
        }
    }
}

