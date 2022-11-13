import {usersCollection} from "../db";

export const usersRepository = {
    async createNewUser(user: userType): Promise<string> {
        await usersCollection.insertOne(user)
        return user.id
    },
    async deleteUserById(id: string): Promise<number> {
        const resultOfDeleting = await usersCollection.deleteOne({id: id})
        return resultOfDeleting.deletedCount;
    }
}


type userType = {
    id: string
    login: string
    password: string
    email: string
    createdAt: string
}