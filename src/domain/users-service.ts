import bcrypt from "bcrypt";
import {UserAccountDB} from "../repositories/mongoose/types";
import {UsersRepository} from "../repositories/users-repositories/users-repository";
import {UsersQueryRepository} from "../repositories/users-repositories/users-query-repository";

export class UsersService {
    usersRepository: UsersRepository;
    usersQueryRepository: UsersQueryRepository;
    constructor() {
        this.usersRepository = new UsersRepository()
        this.usersQueryRepository = new UsersQueryRepository()
    }
    async createNewUser(login: string,
                        password: string,
                        email: string) : Promise<string> {

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, salt)

        const newUser: UserAccountDB = new UserAccountDB((+new Date).toString(), login, passwordHash, email)

        await this.usersRepository.createNewUser(newUser)
        return newUser.id;
    }
    async deleteUserById(id: string) {
        return await this.usersRepository.deleteUserById(id)
    }
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) return;
        if (await bcrypt.compare(password, user.accountData.password)) {
            return user;
        }
        return;
    }
    async _generateHash(password: string, salt: string){
        return await bcrypt.hash(password, salt)
    }
}
