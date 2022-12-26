import {OutputObjectType, QueryParamsTypeForUsers, UserAccountDBType, UserType} from "../mongoose/types";
import {UserModel} from "../mongoose/mongoose-schemes";


export const usersQueryRepository = {
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

        const dbUsers: UserAccountDBType[] = await UserModel.find(filter)
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize)
            .lean()

        const usersArray: UserType[] = dbUsers.map(user => this.mapDbUsersTypeToOutputUsersType(user))

        return await this._createOutputObject(filter,
            +queryParamsObject.pageSize,
            +queryParamsObject.pageNumber,
            usersArray)

    },
    async findUserById(id: string): Promise<UserType | undefined> {
        const user = await UserModel.findOne({id: id});
        if (user) {
            return this.mapDbUsersTypeToOutputUsersType(user)
        }
        return;
    },
    async findRefreshTokenForUserById(id: string) {
        const user = await UserModel.findOne({id: id})
        return user?.refreshToken;
    },
    async findUserByLoginOrEmail(loginOrEmail: string) {
        const user = await UserModel.findOne({$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]});
        if(!user) return null;
        return {
            id: user.id,
            accountData: user.accountData,
            emailConfirmation: user.emailConfirmation,
            isConfirmed: user.isConfirmed
        }
    },
    findUserByConfirmationCode(code: string) {
        return UserModel.findOne({"emailConfirmation.confirmationCode": code})
    },
    _createQueryParamsObject(query: any): QueryParamsTypeForUsers {
        return {
            pageNumber: (query.pageNumber) ? query.pageNumber : '1',
            pageSize: (query.pageSize) ? query.pageSize : '10',
            sortBy: (query.sortBy) ? query.sortBy : "createdAt",
            sortDirection: query.sortDirection ? query.sortDirection : 'desc',
            searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
            searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null
        }
    },

    mapDbUsersTypeToOutputUsersType(dbUser: UserAccountDBType): UserType {
            return {
                id: dbUser.id,
                login: dbUser.accountData.login,
                email: dbUser.accountData.email,
                createdAt: dbUser.accountData.createdAt
            }
        },

    async _createOutputObject(filter: Object,
                               pageSize: number,
                               pageNumber: number,
                               usersArray: UserType[]): Promise<OutputObjectType> {
        return {
            pagesCount: Math.ceil(await UserModel.countDocuments(filter) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await UserModel.countDocuments(filter),
            items: usersArray
        }
    },
}
