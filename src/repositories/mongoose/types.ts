import {ObjectId} from "mongodb";
import {SortOrder} from "mongoose";


export type DbBlogType ={
    _id: ObjectId
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type QueryParamsType = {
    searchNameTerm?: string | null
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortOrder
}

export type BlogsType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type PostsType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type DbPostType = {
    _id: ObjectId
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type CommentsType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId?: string
}

export type DbCommentsType = {
    _id: ObjectId
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId?: string
}

export type OutputObjectType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostsType | CommentsType | UserType>
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
    refreshToken?: string
};

export type UserType = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type QueryParamsTypeForUsers = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortOrder
    searchLoginTerm: string
    searchEmailTerm: string
}

export type AuthSessionsType = {
    userId: string
    sessionId: string
    issuedAt: string
    exp: string
    deviceId: string
    ipAddress: string
    deviceName: {
        name: string
        version: string
    }
}

export type dbSessionsType = {
    _id: ObjectId
    userId: string
    sessionId: string
    issuedAt: string
    exp: string
    deviceId: string
    ipAddress: string
    deviceName: {
        name: string
        version: string
    }
}

export type SessionType = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export type AttemptType = {
    ipAddress: string
    url: string
    issuedAt: number
    attemptsCount: number
}
