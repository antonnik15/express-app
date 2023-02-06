import {LikesModelForComment} from "../mongoose/mongoose-schemes";
import {LikesType} from "../mongoose/types";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async likeOrDislikeComment(commentId: string, likeStatus: string, userId: string) {
        const existLikeStatus: LikesType | null = await LikesModelForComment.findOne({$and: [{userId: userId}, {commentId: commentId}]})

        if (!existLikeStatus) {
            const like: LikesType = new LikesType(userId, commentId, likeStatus)
            await LikesModelForComment.create(like)
            return;
        }
        if (existLikeStatus) {
            if (existLikeStatus.userLikeStatus === likeStatus) {
                return;
            } else {
                await LikesModelForComment.updateOne({userId: userId, commentId: commentId}, {$set: {userLikeStatus: likeStatus}});
                return;
            }
        }
    }
}