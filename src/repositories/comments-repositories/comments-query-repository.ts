import {commentsCollection, CommentsType} from "../db";
import {ObjectId} from "mongodb";


export const commentsQueryRepository = {
    async findCommentById(id: string): Promise<CommentsType | undefined> {
        const dbComment: DbCommentsType | null = await commentsCollection.findOne({id: id});
        if (dbComment) {
            return this.mapDbCommentsToOutputCommentsType(dbComment)
        }
        return;
    },


    mapDbCommentsToOutputCommentsType(dbComments: DbCommentsType): OutputCommentsType {
        return {
            id: dbComments.id,
            content: dbComments.content,
            userId: dbComments.userId,
            userLogin: dbComments.userLogin,
            createdAt: dbComments.createdAt
        }
    }
}

type OutputCommentsType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}

type DbCommentsType = {
    _id: ObjectId
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}