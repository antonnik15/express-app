import {CommentsType, DbCommentsType} from "../mongoose/types";
import {CommentsModel} from "../mongoose/mongoose-schemes";
import {PostsQueryRepository} from "../posts-repositories/posts-query-repository";

export class CommentsQueryRepository extends PostsQueryRepository{
    async findCommentById(id: string, userId: string | undefined): Promise<CommentsType | undefined> {
        const dbComment: DbCommentsType | null = await CommentsModel.findOne({id: id});
        if (dbComment) {
            return this.mapDbCommentsToOutputCommentsType(dbComment, userId)
        }
        return;
    }
}
