import {usersCollection} from "../db";

export const usersRepository = {
    async createNewUser(user: userType) {
        await usersCollection.insertOne(user)
        return;
    },
    async deleteUserById(id: string): Promise<number> {
        const deletionResult = await usersCollection.deleteOne({id: id})
        return deletionResult.deletedCount;
    }
}


type userType = {
    id: string
    login: string
    password: string
    email: string
    createdAt: string
}