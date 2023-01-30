import {ObjectId} from "mongodb";
import {SortOrder} from "mongoose";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";


export class DbBlogType {
    constructor( public _id: ObjectId,
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string) {
    }

}

export class QueryParamsTypeForBlogs {
    constructor(
        public searchNameTerm: string | null,
        public pageNumber: string,
        public pageSize: string,
        public sortBy: string,
        public sortDirection: SortOrder){}
}

export class QueryParamsTypeForPost {
    constructor(
        public pageNumber: string,
        public pageSize: string,
        public sortBy: string,
        public sortDirection: SortOrder){}
}


export class BlogType {
    constructor(public id: string,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string) {
    }
}

export class PostsType {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string) {
    }
}

export class DbPostType  {
    constructor (public _id: ObjectId,
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string) {}
}

export class CommentsType {
    constructor(public id: string,
                public content: string,
                public commentatorInfo: { userId: string, userLogin: string },
                public createdAt: string,
                public likesInfo: {
                    likesCount: number,
                    dislikesCount: number,
                    myStatus: string
                }) {}
}

export class DbCommentsType {
    constructor(
        public _id: ObjectId,
        public id: string,
        public content: string,
        public commentatorInfo: { userId: string, userLogin: string },
        public createdAt: string,
        public likesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string
        },
        public postId?: string) {
    }
}

export class LikesType {
    constructor(public userId: string,
                public commentId: string,
                public userLikeStatus: string) {
    }
}

export class OutputObjectType {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: PostsType[] | Promise <CommentsType>[] | UserType[]) {
    }
}

export class UserAccountDB {
    accountData: {login: string, password: string, email: string, createdAt: string};
    emailConfirmation: {confirmationCode: string, expirationDate: Date};
    isConfirmed: boolean;
    refreshToken?: string;
    recoveryCodeInformation?: {
        recoveryCode?: string,
        expirationDate?: Date
    }
    constructor(public id: string,
                login: string,
                password: string,
                email: string) {
        this.accountData = {
            login: login,
            password: password,
            email: email,
            createdAt: new Date().toISOString()}
        this.emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 0,
                minutes: 5,
                seconds: 5
            })}
        this.isConfirmed = false;
    }
}

export class UserType {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string) {
    }
}

export class QueryParamsTypeForUsers {
    constructor(
        public pageNumber: string,
        public pageSize: string,
        public sortBy: string,
        public sortDirection: SortOrder,
        public searchLoginTerm: string,
        public searchEmailTerm: string) {
    }
}

export class AuthSessionsType {
    constructor(
        public userId: string,
        public sessionId: string,
        public issuedAt: string,
        public exp: string,
        public deviceId: string,
        public ipAddress: string,
        public deviceName: {name: string, version: string}
    ) {}
}

export class dbSessionsType extends AuthSessionsType {
    constructor(public _id: ObjectId,
                userId: string,
                sessionId: string,
                issuedAt: string,
                exp: string,
                deviceId: string,
                ipAddress: string,
                deviceName: { name: string, version: string }) {
        super(userId, sessionId, issuedAt, exp, deviceId, ipAddress, deviceName);
    }
}

export class SessionType {
    constructor(
        public ip: string,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string) {
    }
}

export class AttemptType {
    constructor(public ipAddress: string,
                public url: string,
                public issuedAt: number,
                public attemptsCount: number) {
    }
}
