import {authSessionsCollection} from "../mongoose/db";
import {ObjectId} from "mongodb";

export const securityDevicesQueryRepository = {
    async findSessionByJWTPayload(jwtPayload: any) {
        const authSession: dbSessionsType | null = await authSessionsCollection.findOne({
            userId: jwtPayload.userId,
            issuedAt: jwtPayload.iat,
            exp: jwtPayload.exp,
            deviceId: jwtPayload.deviceId
        });
        if (!authSession) return null;
        return authSession;
    },
    async findUserAuthSessions(userId: string) {
        const dbAuthSessions: dbSessionsType[] = await authSessionsCollection.find({userId: userId}).toArray();
        const authSessionsArray: OutputSessionType[] = dbAuthSessions.map(sess => this._mapDbSessionsTypeToOutputSessionType(sess))
        return authSessionsArray;
    },
    async findSessionByDeviceId(deviceId: string): Promise<dbSessionsType | null> {
        return await authSessionsCollection.findOne({deviceId: deviceId});
    },
    _mapDbSessionsTypeToOutputSessionType(session: dbSessionsType): OutputSessionType {
        return {
            ip: session.ipAddress,
            title: session.deviceName.name,
            lastActiveDate: new Date(+session.issuedAt * 1000).toISOString(),
            deviceId: session.deviceId
        }
    }
}

export type dbSessionsType = {
    _id: ObjectId
    userId: string
    sessionId: string
    issuedAt: string
    exp: string
    deviceId: string
    ipAddress: string
    deviceName: {
        name: string
        version: string
    }
}

type OutputSessionType = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}
