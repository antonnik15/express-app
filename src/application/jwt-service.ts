import jwt from 'jsonwebtoken';
import {usersService} from "../domain/users-service";

export const jwtService = {
    createAccessToken(id: string) {
        return jwt.sign({userId: id}, process.env.JWT_SECRET!, {expiresIn: "10s"})
    },
    async createRefreshToken(id: string) {
        const refreshToken = jwt.sign({userId: id}, process.env.JWT_REFRESH_SECRET!, {expiresIn: '20s'});
        await usersService.addRefreshToken(id, refreshToken)
        return refreshToken;
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return result.userId
        } catch (err) {
            return null;
        }
    },
    async verifyRefreshToken(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
            return result.userId;
        } catch (err) {
            return null;
        }
    }
}
