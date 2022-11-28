import {usersRepository} from "../repositories/users-repositories/users-repository";
import bcrypt from "bcrypt";
import {usersQueryRepository} from "../repositories/users-repositories/users-query-repository";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
export const usersService = {
    async createNewUser(login: string,
                        password: string,
                        email: string) : Promise<string> {

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, salt)

        const newUser = {
            id: (+new Date()).toString(),
            accountData: {
                login: login,
                email,
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
        return newUser.id;
    },
    async deleteUserById(id: string) {
        return await usersRepository.deleteUserById(id)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail);
        debugger;
        if (!user) return;
        // if (!user.isConfirmed) return null;
        if (await bcrypt.compare(password, user.accountData.password)) {
            return user;
        }
        return;
    },
    async _generateHash(password: string, salt: string){
        return await bcrypt.hash(password, salt)
    }
}