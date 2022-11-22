import {usersRepository} from "../repositories/users-repositories/users-repository";
import bcrypt from "bcrypt";
import {usersQueryRepository} from "../repositories/users-repositories/users-query-repository";
export const usersService = {
    async createNewUser(login: string,
                        password: string,
                        email: string) : Promise<string> {

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, salt)

        const newUser = {
            id: (+new Date()).toString(),
            login: login,
            password: passwordHash,
            email: email,
            createdAt: (new Date()).toISOString()
        }

        await usersRepository.createNewUser(newUser)
        return newUser.id;
    },
    async deleteUserById(id: string) {
        return await usersRepository.deleteUserById(id)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) return;
        if (await bcrypt.compare(password, user.password)) {
            return user;
        }
        return;
    },
    async _generateHash(password: string, salt: string){
        return await bcrypt.hash(password, salt)
    }
}