import mongoose from "mongoose";
import {
    AttemptType,
    AuthSessionsType,
    BlogType,
    DbCommentsType, LikesType, LikesTypeForPost,
    PostsType,
    UserAccountDB,
} from "./types";

const Schema = mongoose.Schema;

const blogsSchema = new Schema<BlogType>({
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
    createdAt: {type: String},
    extendedLikesInfo: {
        type: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String,
            newestLikes: [{
                addedAt: Date,
                userId: String,
                login: String
            }]
        }
    }
})
export const PostsModel = mongoose.model("Post", postsSchema)

const commentsSchema = new Schema<DbCommentsType>({
    id: {type: String},
    content: {type: String},
    commentatorInfo: {type: {userId: String, userLogin: String}},
    createdAt: String,
    likesInfo: {
        type: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String
        }
    },
    postId: {type: String}
})
export const CommentsModel = mongoose.model("Comment", commentsSchema);

const likesSchemaForComment = new Schema<LikesType>({
    userId: {type: String},
    commentId: {type: String},
    userLikeStatus: {type: String}
})
export const LikesModelForComment = mongoose.model("Likes", likesSchemaForComment)

const likesSchemaForPost = new Schema<LikesTypeForPost>({
    userId: {type: String},
    postId: {type: String},
    userLikeStatus: {type: String},
    login: String,
    addedAt: String
})
export const LikesModelForPost = mongoose.model("LikesForPosts", likesSchemaForPost)

const usersSchema = new Schema<UserAccountDB, {canBeConfirmed: () => boolean}>({
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
    refreshToken: {type: String},
    recoveryCodeInformation: {
        recoveryCode: {type: String},
        expirationDate: Date
    }
})

export const UserModel = mongoose.model<UserAccountDB>('User', usersSchema)


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
