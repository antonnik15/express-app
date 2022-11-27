import jwt from 'jsonwebtoken';
import {UserAccountDBType} from "../repositories/db";

export const jwtService = {
    async createJWT(user: UserAccountDBType) {
        return jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: "1h"})
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return result.userId
        } catch (err) {
            return null;
        }
    }
}
