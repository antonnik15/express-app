import {CommentsModel} from "../mongoose/mongoose-schemes";

export class CommentsRepository {
    async likeOrDislikeComment(commentId: string, likeStatus: string) {
        if (likeStatus === 'Like') {
            await CommentsModel.updateOne({id: commentId}, {$inc: {"likesInfo.likesCount": 1}, "likesInfo.myStatus": 'Like'})
        }
        if (likeStatus === 'Dislike') {
            await CommentsModel.updateOne({id: commentId}, {$inc: {"likesInfo.likesCount": 1}, "likesInfo.myStatus": 'Dislike'})
        }
    }
}