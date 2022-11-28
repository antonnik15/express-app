import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid"
import add from "date-fns/add"
import {UserAccountDBType, usersRepository} from "../repositories/users-repositories/users-repository";
import {emailAdapter} from "../adapter/email-adapter";
import {usersQueryRepository} from "../repositories/users-repositories/users-query-repository";

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

    async _generateHash(password: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

