import {ObjectId, SortDirection} from "mongodb";
import {usersCollection} from "../db";


export const usersQueryRepository = {
    async findAllUsers(query: any): Promise<OutputObjectType> {
        const queryParamsObject: QueryParamsType = this._createQueryParamsObject(query)

        let filter = {}
        if (queryParamsObject.searchLoginTerm || queryParamsObject.searchEmailTerm) {
            filter = {
                $or: [{login: {$regex: queryParamsObject.searchLoginTerm, $options: 'i'}},
                    {email: {$regex: queryParamsObject.searchEmailTerm, $options: 'i'}}]
            }
        }

        const countOfSkipElem: number = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbUsers: DbUsersType[] = await usersCollection.find(filter)
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize)
            .toArray()

        const usersArray: OutPutUsersType[] = dbUsers.map(user => this.mapDbUsersTypeToOutputUsersType(user))

        return await this._createOutputObject(filter,
            +queryParamsObject.pageSize,
            +queryParamsObject.pageNumber,
            usersArray)

    },
    async findUserById(id: string): Promise<OutPutUsersType | undefined> {
        const user = await usersCollection.findOne({id: id});
        if (user) {
            return this.mapDbUsersTypeToOutputUsersType(user)
        }
        return;
    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{login: loginOrEmail, email: loginOrEmail}]})
    },

    _createQueryParamsObject(query: any): QueryParamsType {
        return {
            pageNumber: (query.pageNumber) ? query.pageNumber : '1',
            pageSize: (query.pageSize) ? query.pageSize : '10',
            sortBy: (query.sortBy) ? query.sortBy : "createdAt",
            sortDirection: query.sortDirection ? query.sortDirection : 'desc',
            searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
            searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null
        }
    },

    mapDbUsersTypeToOutputUsersType(dbUser: DbUsersType): OutPutUsersType {
            return {
                id: dbUser.id,
                login: dbUser.login,
                email: dbUser.email,
                createdAt: dbUser.createdAt
            }
        },

    async _createOutputObject(filter: Object,
                               pageSize: number,
                               pageNumber: number,
                               usersArray: OutPutUsersType[]): Promise<OutputObjectType> {
        return {
            pagesCount: Math.ceil(await usersCollection.count(filter) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await usersCollection.count(filter),
            items: usersArray
        }
    },
}

export type DbUsersType = {
    _id: ObjectId
    id: string
    login: string
    password: string
    email: string
    createdAt: string
}


export type OutPutUsersType = {
    id: string
    login: string
    email: string
    createdAt: string
}

type OutputObjectType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: OutPutUsersType[]
}

type QueryParamsType = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
    searchLoginTerm: string
    searchEmailTerm: string
}