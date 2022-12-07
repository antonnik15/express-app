import {authSessionsCollection, AuthSessionsType} from "../db";

export const securityDevicesRepository = {
    async createNewAuthSession(newAuthSession: AuthSessionsType): Promise<undefined> {
        await authSessionsCollection.insertOne(newAuthSession);
        return;
    },
    async updateCurrentAuthSession(jwtPayload: any) {
        await authSessionsCollection.updateOne({
            userId: jwtPayload.userId,
            deviceId: jwtPayload.deviceId
        }, {$set: {issuedAt: jwtPayload.iat, exp: jwtPayload.exp}})
        return;
    },
    async deleteCurrentAuthSession(payload: any) {
        await authSessionsCollection.deleteOne({userId: payload.userId, deviceId: payload.deviceId})
        return;
    },
    async terminateAllAuthSessionsForCurrentUser(userId: string) {
        await authSessionsCollection.deleteMany({userId: userId});
        return;
    },
    async terminateCurrentSessionByDeviceId(userId: string, deviceId: string) {
        const deletionResult = await authSessionsCollection.deleteOne({userId: userId, deviceId: deviceId});
        return deletionResult.deletedCount;
    }
}