import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid"
import add from "date-fns/add"
import {usersRepository} from "../repositories/users-repositories/users-repository";
import {emailAdapter} from "../adapter/email-adapter";
import {usersQueryRepository} from "../repositories/users-repositories/users-query-repository";
import {jwtService} from "../application/jwt-service";
import {securityDevicesRepository} from "../repositories/security-devices-repositories/security-devices-repository";
import {
    securityDevicesQueryRepository
} from "../repositories/security-devices-repositories/security-devices-query-repository";
import {AuthSessionsType, dbSessionsType, UserAccountDBType} from "../repositories/mongoose/types";

export const authService = {
    async createNewUser(login: string, password: string, email: string) {
        const passwordHash = await this._generateHash(password);
        const newUser: UserAccountDBType = {
            id: (+new Date()).toString(),
            accountData: {
                login: login,
                email: email,
                password: passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 0,
                    minutes: 5,
                    seconds: 5
                })
            },
            isConfirmed: false
        };

        await usersRepository.createNewUser(newUser)
        await emailAdapter.sendEmailConfirmationMessage(newUser);
        return newUser.id;
    },
    async confirmEmail(code: string) {
        const user = await usersQueryRepository.findUserByConfirmationCode(code);
        if (!user) return null;
        if (user.emailConfirmation.expirationDate < new Date()) return null;
        if (user.isConfirmed) return null;

        return await usersRepository.updateConfirmation(user.id);
    },
    async resendEmailConfirmationMessage(email: string) {
        const user = await usersQueryRepository.findUserByLoginOrEmail(email)
        if (!user || user.isConfirmed) return null;
        await this.updateConfirmationCode(user.id);
        const userWithNewConfirmationCode = await usersQueryRepository.findUserByLoginOrEmail(email);
        await emailAdapter.sendEmailConfirmationMessage(userWithNewConfirmationCode!)
        return userWithNewConfirmationCode!.id;
    },
    async updateConfirmationCode(id: string) {
        await usersRepository.updateConfirmationCode(id);
        return;
    },
    async sendRecoveryCode(email: string) {
        const user = await usersQueryRepository.findUserByLoginOrEmail(email);
        if (!user) return null;
        const recoveryCode: string = await usersRepository.createRecoveryCode(user.id);
        await emailAdapter.sendRecoveryCode(user, recoveryCode);
        return;
    },
    async recoveryPassword(password: string, recoveryCode: string): Promise<number | null> {
        const user = await usersQueryRepository.findUserByRecoveryCode(recoveryCode);
        if (!user) return null;
        if (user.recoveryCodeInformation!.expirationDate! < new Date()) return null;
        return await usersRepository.updatePassword(user.id, password);
    },
    async checkRefreshToken(refreshToken: string) {
        const jwtPayload = jwtService.getJWTPayload(refreshToken);
        if (!jwtPayload) return null;
        const currentAuthSession: dbSessionsType | null = await securityDevicesQueryRepository.findSessionByJWTPayload(jwtPayload);
        if (!currentAuthSession) return null;
        return jwtPayload;
    },
    async _generateHash(password: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },
    async createDeviceAuthSession(refreshToken: string, deviceInfo: any, ipAddress: string) {
        const jwtPayload = jwtService.getJWTPayload(refreshToken)
        const newSession: AuthSessionsType = {
            userId: jwtPayload.userId,
            sessionId: (+new Date() * 2).toString(),
            issuedAt: jwtPayload.iat,
            exp: jwtPayload.exp,
            deviceId: jwtPayload.deviceId,
            ipAddress: ipAddress,
            deviceName: {
                name: deviceInfo.browser.name,
                version: deviceInfo.browser.version
            }
        }
        await securityDevicesRepository.createNewAuthSession(newSession);
        return;
    },
    async updateCurrentAuthSession(refreshToken: string) {
        const jwtPayload = jwtService.getJWTPayload(refreshToken);
        await securityDevicesRepository.updateCurrentAuthSession(jwtPayload)
        return;
    },
    async deleteCurrentAuthSession(jwtPayload: any) {
        await securityDevicesRepository.deleteCurrentAuthSession(jwtPayload);
        return;
    }
}


