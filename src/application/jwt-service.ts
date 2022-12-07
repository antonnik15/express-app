import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from "uuid";

export const jwtService = {
    async createAccessToken(id: string) {
        return jwt.sign({userId: id}, process.env.JWT_SECRET!, {expiresIn: "1h"})
    },
    async createRefreshToken(userId: string, deviceId: string = uuidv4()): Promise<string> {
        return jwt.sign({userId: userId, deviceId: deviceId}, process.env.JWT_REFRESH_SECRET!, {expiresIn: '1h'});
    },
    getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return result.userId;
        } catch (err) {
            return null;
        }
    },
    getJWTPayload(token: string) {
        try {
            const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!)
            return JSON.parse(JSON.stringify(payload))
        } catch (err) {
            return null;
        }
    }
}
