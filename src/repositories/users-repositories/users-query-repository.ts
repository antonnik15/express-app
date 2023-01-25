import {OutputObjectType, QueryParamsTypeForUsers, UserAccountDB, UserType} from "../mongoose/types";
import {UserModel} from "../mongoose/mongoose-schemes";

export class UsersQueryRepository {
    async findAllUsers(query: any): Promise<OutputObjectType> {
        const queryParamsObject: QueryParamsTypeForUsers = this._createQueryParamsObject(query)

        let filter = {}
        if (queryParamsObject.searchLoginTerm || queryParamsObject.searchEmailTerm) {
            filter = {
                $or: [{"accountData.login": {$regex: queryParamsObject.searchLoginTerm, $options: 'i'}},
                    {"accountData.email": {$regex: queryParamsObject.searchEmailTerm, $options: 'i'}}]
            }
        }

        const countOfSkipElem: number = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbUsers: UserAccountDB[] = await UserModel.find(filter)
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize)
            .lean()

        const usersArray: UserType[] = dbUsers.map(user => this.mapDbUsersTypeToOutputUsersType(user))

        return await this._createOutputObject(filter,
            +queryParamsObject.pageSize,
            +queryParamsObject.pageNumber,
            usersArray)

    }
    async findUserById(id: string): Promise<UserType | undefined> {
        const user = await UserModel.findOne({id: id});
        if (user) {
            return this.mapDbUsersTypeToOutputUsersType(user)
        }
        return;
    }
    async findRefreshTokenForUserById(id: string) {
        const user = await UserModel.findOne({id: id})
        return user?.refreshToken;
    }
    async findUserByLoginOrEmail(loginOrEmail: string) {
        const user = await UserModel.findOne({$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]});
        if(!user) return null;
        return {
            id: user.id,
            accountData: user.accountData,
            emailConfirmation: user.emailConfirmation,
            isConfirmed: user.isConfirmed
        }
    }
    findUserByConfirmationCode(code: string) {
        return UserModel.findOne({"emailConfirmation.confirmationCode": code})
    }
    _createQueryParamsObject(query: any): QueryParamsTypeForUsers {
        return new QueryParamsTypeForUsers((query.pageNumber) ? query.pageNumber : '1',
            (query.pageSize) ? query.pageSize : '10',
            (query.sortBy) ? query.sortBy : "createdAt",
            query.sortDirection ? query.sortDirection : 'desc',
            query.searchLoginTerm ? query.searchLoginTerm : null,
            query.searchEmailTerm ? query.searchEmailTerm : null)
    }

    mapDbUsersTypeToOutputUsersType(dbUser: UserAccountDB): UserType {
        return new UserType(dbUser.id,
            dbUser.accountData.login,
            dbUser.accountData.email,
            dbUser.accountData.createdAt)
    }

    async _createOutputObject(filter: Object,
                              pageSize: number,
                              pageNumber: number,
                              usersArray: UserType[]): Promise<OutputObjectType> {
        return new OutputObjectType(
            Math.ceil(await UserModel.countDocuments(filter) / pageSize),
            pageNumber,
            pageSize,
            await UserModel.countDocuments(filter),
            usersArray)
    }

    async findUserByRecoveryCode(recoveryCode: string): Promise<UserAccountDB |null> {
        return UserModel.findOne({'recoveryCodeInformation.recoveryCode': recoveryCode});
    }
}