import {AuthSessionsType} from "../mongoose/types";
import {AuthModel} from "../mongoose/mongoose-schemes";

export class SecurityDevicesRepository {
    async createNewAuthSession(newAuthSession: AuthSessionsType): Promise<undefined> {
        await AuthModel.create(newAuthSession);
        return;
    }
    async updateCurrentAuthSession(jwtPayload: any) {
        await AuthModel.updateOne({
            userId: jwtPayload.userId,
            deviceId: jwtPayload.deviceId
        }, {$set: {issuedAt: jwtPayload.iat, exp: jwtPayload.exp}})
        return;
    }
    async deleteCurrentAuthSession(payload: any) {
        await AuthModel.deleteOne({userId: payload.userId, deviceId: payload.deviceId})
        return;
    }
    async terminateAllAuthSessionsForCurrentUser(jwtPayload: any) {
        await AuthModel.deleteMany({userId: jwtPayload.userId, deviceId: {$ne: jwtPayload.deviceId}});
        return;
    }
    async terminateCurrentSessionByDeviceId(userId: string, deviceId: string) {
        await AuthModel.deleteOne({userId: userId, deviceId: deviceId});
        return;
    }
}