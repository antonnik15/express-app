import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UserAccountDBType} from "../mongoose/types";
import {UserModel} from "../mongoose/mongoose-schemes";


export const usersRepository = {
    async createNewUser(user: UserAccountDBType) {
        await UserModel.create(user)
        return;
    },
    async deleteUserById(id: string): Promise<number> {
        const deletionResult = await UserModel.deleteOne({id: id})
        return deletionResult.deletedCount;
    },
    async updateConfirmation(id: string) {
        const resultOfChange = await UserModel.updateOne({id: id}, {$set: {isConfirmed: true}})
        return resultOfChange.modifiedCount;
    },
    async updatePassword(id: string, password: string) {
        const resultOfChange = await UserModel.updateOne({id: id}, {$set: {"accountData.password": password}})
        return resultOfChange.modifiedCount;
    },
    async updateConfirmationCode(id: string) {
        await UserModel.updateOne({id: id}, {
            $set: {
                "emailConfirmation.confirmationCode": uuidv4(),
                "emailConfirmation.expirationDate": add(new Date(), {
                    hours: 1
                })
            }
        })
        return;
    },
    async createRecoveryCode(id: string): Promise<string> {
        const recoveryCode = uuidv4();
        await UserModel.updateOne({id: id}, {
            $set: {
                "recoveryCodeInformation.recoveryCode": recoveryCode,
                "recoveryCodeInformation.expirationDate": add(new Date(), {hours: 1})
            }
        });
        return recoveryCode;
    }
}
