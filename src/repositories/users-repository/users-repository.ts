import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UserModel} from "../mongoose/mongoose-schemes";
import {UserAccountDB} from "../mongoose/types";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async createNewUser(user: UserAccountDB) {
        await UserModel.create(user)
        return;
    }
    async deleteUserById(id: string): Promise<number> {
        const deletionResult = await UserModel.deleteOne({id: id})
        return deletionResult.deletedCount;
    }
    async updateConfirmation(id: string) {
        const resultOfChange = await UserModel.updateOne({id: id}, {$set: {isConfirmed: true}})
        return resultOfChange.modifiedCount;
    }
    async updatePassword(id: string, passwordHash: string) {
        const resultOfChange = await UserModel.updateOne({id: id}, {$set: {"accountData.password": passwordHash}})
        return resultOfChange.modifiedCount;
    }
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
    }
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

