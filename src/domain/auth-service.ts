import bcrypt from "bcrypt";
import {AuthSessionsType, dbSessionsType, UserAccountDB} from "../repositories/mongoose/types";
import {UsersRepository} from "../repositories/users-repository/users-repository";
import {UsersQueryRepository} from "../repositories/users-repository/users-query-repository";
import {EmailAdapter} from "../adapter/email-adapter";
import {JwtService} from "../application/jwt-service";
import {
    SecurityDevicesQueryRepository
} from "../repositories/security-devices-repositories/security-devices-query-repository";
import {SecurityDevicesRepository} from "../repositories/security-devices-repositories/security-devices-repository";
import {inject, injectable} from "inversify";

@injectable()
export class AuthService {
    constructor(@inject('UsersRepository') public usersRepository: UsersRepository,
                @inject('EmailAdapter') public emailAdapter: EmailAdapter,
                @inject('UsersQueryRepository') public usersQueryRepository: UsersQueryRepository,
                @inject('JwtService') public jwtService: JwtService,
                @inject('SecurityDevicesQueryRepository') public securityDevicesQueryRepository: SecurityDevicesQueryRepository,
                @inject('SecurityDevicesRepository') public securityDevicesRepository: SecurityDevicesRepository) {
    }

    async createNewUser(login: string, password: string, email: string) {
        const passwordHash = await this._generateHash(password);
        const newUser: UserAccountDB = new UserAccountDB((+new Date()).toString(), login, passwordHash, email)

        await this.usersRepository.createNewUser(newUser)
        await this.emailAdapter.sendEmailConfirmationMessage(newUser);
        return newUser.id;
    }
    async confirmEmail(code: string, email: string) {
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(email)
        if (!user) return null;
        if ( user.emailConfirmation.confirmationCode === code
            && user.emailConfirmation.expirationDate < new Date()) return null;
        if (user.isConfirmed) return null;

        return await this.usersRepository.updateConfirmation(user.id);
    }
    async resendEmailConfirmationMessage(email: string) {
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(email)
        if (!user || user.isConfirmed) return null;
        await this.updateConfirmationCode(user.id);
        const userWithNewConfirmationCode = await this.usersQueryRepository.findUserByLoginOrEmail(email);
        await this.emailAdapter.sendEmailConfirmationMessage(userWithNewConfirmationCode!)
        return userWithNewConfirmationCode!.id;
    }
    async updateConfirmationCode(id: string) {
        await this.usersRepository.updateConfirmationCode(id);
        return;
    }
    async sendRecoveryCode(email: string) {
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(email);
        if (!user) return null;
        const recoveryCode: string = await this.usersRepository.createRecoveryCode(user.id);
        await this.emailAdapter.sendRecoveryCode(user, recoveryCode);
        return;
    }
    async recoveryPassword(password: string, recoveryCode: string): Promise<number | null> {
        const user = await this.usersQueryRepository.findUserByRecoveryCode(recoveryCode);
        if (!user) return null;
        if (user.recoveryCodeInformation!.expirationDate! < new Date()) return null;
        const passwordHash = await this._generateHash(password)
        return await this.usersRepository.updatePassword(user.id, passwordHash);
    }
    async checkRefreshToken(refreshToken: string) {
        const jwtPayload = this.jwtService.getJWTPayload(refreshToken);
        if (!jwtPayload) return null;
        const currentAuthSession:  dbSessionsType | null = await this.securityDevicesQueryRepository.findSessionByJWTPayload(jwtPayload);
        if (!currentAuthSession) return null;
        return jwtPayload;
    }
    async _generateHash(password: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    async createDeviceAuthSession(refreshToken: string, deviceInfo: any, ipAddress: string) {
        const jwtPayload = this.jwtService.getJWTPayload(refreshToken)

        const newSession: AuthSessionsType = new AuthSessionsType(
            jwtPayload.userId,
            (+new Date() * 2).toString(),
            jwtPayload.iat,
            jwtPayload.exp,
            jwtPayload.deviceId,
            ipAddress, {
                name: deviceInfo.browser.name,
                version: deviceInfo.browser.version
            })

        await this.securityDevicesRepository.createNewAuthSession(newSession);
        return;
    }
    async updateCurrentAuthSession(refreshToken: string) {
        const jwtPayload = this.jwtService.getJWTPayload(refreshToken);
        await this.securityDevicesRepository.updateCurrentAuthSession(jwtPayload)
        return;
    }
    async deleteCurrentAuthSession(jwtPayload: any) {
        await this.securityDevicesRepository.deleteCurrentAuthSession(jwtPayload);
        return;
    }
}

