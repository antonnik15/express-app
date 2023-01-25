import {CommentsType, DbCommentsType} from "../mongoose/types";
import {CommentsModel} from "../mongoose/mongoose-schemes";

export class CommentsQueryRepository {
    async findCommentById(id: string): Promise<CommentsType | undefined> {
        const dbComment: DbCommentsType | null = await CommentsModel.findOne({id: id});
        if (dbComment) {
            return this.mapDbCommentsToOutputCommentsType(dbComment)
        }
        return;
    }

    mapDbCommentsToOutputCommentsType(dbComments: DbCommentsType): CommentsType {
        return new CommentsType(
            dbComments.id,
            dbComments.content,
            {userId: dbComments.commentatorInfo.userId, userLogin: dbComments.commentatorInfo.userLogin},
            dbComments.createdAt,
            {
                likesCount: dbComments.likesInfo.likesCount,
                dislikesCount: dbComments.likesInfo.dislikesCount,
                myStatus: dbComments.likesInfo.myStatus
            })
    }
}
