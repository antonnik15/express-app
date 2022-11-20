import {usersRepository} from "../repositories/users-repositories/users-repository";
import bcrypt from "bcrypt";
import {usersQueryRepository} from "../repositories/users-repositories/users-query-repository";
export const usersService = {
    async createNewUser(login: string,
                        password: string,
                        email: string) : Promise<string> {
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, salt)
        await console.log(salt)
        const newUser = {
            id: (+new Date()).toString(),
            login: login,
            password: passwordHash,
            email: email,
            createdAt: (new Date()).toISOString()
        }
        return await usersRepository.createNewUser(newUser)
    },
    async deleteUserById(id: string) {
        if (await usersRepository.deleteUserById(id)) return 204;
        else return 404;
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