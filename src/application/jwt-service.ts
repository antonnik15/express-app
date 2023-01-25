import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from "uuid";

export class JwtService {
    async createAccessToken(id: string) {
        return jwt.sign({userId: id}, process.env.JWT_SECRET!, {expiresIn: "10m"})
    }
    async createRefreshToken(userId: string, deviceId: string = uuidv4()): Promise<string> {
        return jwt.sign({userId: userId, deviceId: deviceId}, process.env.JWT_REFRESH_SECRET!, {expiresIn: '20m'});
    }
    getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return result.userId;
        } catch (err) {
            return null;
        }
    }
    getJWTPayload(token: string) {
        try {
            const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!)
            return JSON.parse(JSON.stringify(payload))
        } catch (err) {
            return null;
        }
    }
}
