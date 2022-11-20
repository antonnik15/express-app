import {ObjectId, SortDirection} from "mongodb";
import {usersCollection} from "../db";

export const usersQueryRepository = {
    async findAllUsers(pageNumber: string | undefined = '1',
                       pageSize: string | undefined = '10',
                       sortBy: string | undefined = 'createdAt',
                       sortDirection: SortDirection = 'desc',
                       searchLoginTerm: undefined | string,
                       searchEmailTerm: undefined | string) {
        let filter = {}
        if (searchLoginTerm || searchEmailTerm) {
            filter = {
                $or: [{login: {$regex: searchLoginTerm, $options: 'i'}},
                    {email: {$regex: searchEmailTerm, $options: 'i'}}]
            }
        }
        const countOfSkipElem: number = (+pageNumber - 1) * (+pageSize);
        const dbUsersArray: DbUsersType[] = await usersCollection.find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(countOfSkipElem)
            .limit(+pageSize)
            .toArray()
        const outPutArray: OutPutUsersType[] = dbUsersArray
            .map(user => this.mapDbUsersTypeToOutputUsersType(user))

        return await this.createOfOutputObject(filter,
            +pageSize,
            +pageNumber,
            outPutArray)

    },
    async findUserById(id: string): Promise<OutPutUsersType | null> {
        const user = await usersCollection.findOne({id: id});
        if (user) {
            return this.mapDbUsersTypeToOutputUsersType(user)
        }
        return null;
    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{login: loginOrEmail, email: loginOrEmail}]})
    },

    mapDbUsersTypeToOutputUsersType(dbUser: DbUsersType): OutPutUsersType {
            return {
                id: dbUser.id,
                login: dbUser.login,
                email: dbUser.email,
                createdAt: dbUser.createdAt
            }
        },

    async createOfOutputObject(filter: Object,
                               pageSize: number,
                               pageNumber: number,
                               usersArray: OutPutUsersType[]): Promise<OutputObjectWithPaginationType> {
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

type OutputObjectWithPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: OutPutUsersType[]
}
