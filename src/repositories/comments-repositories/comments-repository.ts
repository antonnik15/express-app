import {LikesModel} from "../mongoose/mongoose-schemes";
import {LikesType} from "../mongoose/types";

export class CommentsRepository {
    async likeOrDislikeComment(commentId: string, likeStatus: string, userId: string) {
        const existLikeStatus: LikesType | null = await LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})

        if (!existLikeStatus) {
            const like: LikesType = new LikesType(userId, commentId, likeStatus)
            await LikesModel.create(like)
            return;
        }
        debugger;
        if (existLikeStatus) {
            if (existLikeStatus.userLikeStatus === likeStatus) {
                return;
            } else {
                await LikesModel.updateOne({userId: userId, commentId: commentId}, {$set: {userLikeStatus: likeStatus}});
                return;
            }
        }
    }
}