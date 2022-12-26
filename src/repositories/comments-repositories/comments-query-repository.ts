import {CommentsType, DbCommentsType} from "../mongoose/types";
import {CommentsModel} from "../mongoose/mongoose-schemes";

export const commentsQueryRepository = {
    async findCommentById(id: string): Promise<CommentsType | undefined> {
        const dbComment: DbCommentsType | null = await CommentsModel.findOne({id: id});
        if (dbComment) {
            return this.mapDbCommentsToOutputCommentsType(dbComment)
        }
        return;
    },


    mapDbCommentsToOutputCommentsType(dbComments: DbCommentsType): CommentsType {
        return {
            id: dbComments.id,
            content: dbComments.content,
            userId: dbComments.userId,
            userLogin: dbComments.userLogin,
            createdAt: dbComments.createdAt
        }
    }
}
