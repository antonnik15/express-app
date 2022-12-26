import mongoose from "mongoose";
import {AttemptType, AuthSessionsType, BlogsType, CommentsType, PostsType, UserAccountDBType} from "./types";

const Schema = mongoose.Schema;

const blogsSchema = new Schema<BlogsType>({
    id: {type: String},
    name: {type: String},
    description: {type: String},
    websiteUrl: {type: String},
    createdAt: {type: String}
})
export const BlogsModel = mongoose.model("Blog", blogsSchema);


const postsSchema = new Schema<PostsType>({
    id: {type: String},
    title: {type: String},
    shortDescription: {type: String},
    content: {type: String},
    blogId: {type: String},
    blogName: {type: String},
    createdAt: {type: String}
})
export const PostsModel = mongoose.model("Post", postsSchema)

const commentsSchema = new Schema<CommentsType>({
    id: {type: String},
    content: {type: String},
    userId: {type: String},
    userLogin: {type: String},
    createdAt: {type: String},
    postId: {type: String}
})
export const CommentsModel = mongoose.model("Comment", commentsSchema);

const usersSchema = new Schema<UserAccountDBType>({
    id: {type: String},
    accountData: {
        login: {type: String},
        email: {type: String},
        password: {type: String},
        createdAt: {type: String},
    },
    emailConfirmation: {
        confirmationCode: {type: String},
        expirationDate: Date
    },
    isConfirmed: {type: Boolean},
    refreshToken: {type: String}
})
export const UserModel = mongoose.model('User', usersSchema)

const authSchema = new Schema<AuthSessionsType>({
    userId: {type: String},
    sessionId: {type: String},
    issuedAt: {type: String},
    exp: {type: String},
    deviceId: {type: String},
    ipAddress: {type: String},
    deviceName: {
        name: {type: String},
        version: {type: String},
    }
})
export const AuthModel = mongoose.model("Session", authSchema)

const attemptSchema = new Schema<AttemptType>({
    ipAddress: {type: String},
    url: {type: String},
    issuedAt: {type: Number},
    attemptsCount: {type: Number}
})
export const AttemptModel = mongoose.model("Attempt", attemptSchema)
