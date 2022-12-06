import {usersCollection} from "../db";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";


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
    },
    async updateConfirmationCode(id: string) {
        await usersCollection.updateOne({id: id}, {
            $set: {
                "emailConfirmation.confirmationCode": uuidv4(),
                "emailConfirmation.expirationDate": add(new Date(), {
                    hours: 1
                })
            }
        })
        return;
    },

    async addRefreshToken(id: string, refreshToken: string) {
        await usersCollection.updateOne({id: id}, {$set: {refreshToken: refreshToken}});
        return;
    },
    async deleteRefreshToken(id: string) {
        await usersCollection.updateOne({id: id}, {$unset: {refreshToken: 1}})
        return;
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