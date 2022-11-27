import {usersCollection} from "../db";


export const usersRepository = {
    async createNewUser(user: UserAccountDBType) {
        await usersCollection.insertOne(user)
        return;
    },
    async deleteUserById(id: string): Promise<number> {
        const deletionResult = await usersCollection.deleteOne({id: id})
        return deletionResult.deletedCount;
    },
    async updateConfirmation(id: string) {
        const resultOfChange = await usersCollection.updateOne({id: id}, {$set: {isConfirmed: true}})
        return resultOfChange.modifiedCount;
    }
}


export type UserAccountDBType = {
    id: string
    accountData: {
        login: string
        email: string
        password: string
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
    },
    isConfirmed: boolean
};