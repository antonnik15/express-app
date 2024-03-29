import {CommentsType, DbCommentsType} from "../mongoose/types";
import {CommentsModel} from "../mongoose/mongoose-schemes";
import {PostsQueryRepository} from "../posts-repositories/posts-query-repository";
import {injectable} from "inversify";

@injectable()
export class CommentsQueryRepository extends PostsQueryRepository{
    async findCommentById(id: string, user: any): Promise<CommentsType | undefined> {
        const dbComment: DbCommentsType | null = await CommentsModel.findOne({id: id});
        if (dbComment) {
            return this.mapDbCommentsToOutputCommentsType(dbComment, user?.id)
        }
        return;
    }
}
