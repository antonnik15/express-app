import {CommentsModel} from "../repositories/mongoose/mongoose-schemes";
import {CommentsRepository} from "../repositories/comments-repositories/comments-repository";
import {CommentsQueryRepository} from "../repositories/comments-repositories/comments-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(@inject('CommentsRepository') public commentsRepository: CommentsRepository,
                @inject('CommentsQueryRepository') public commentsQueryRepository: CommentsQueryRepository) {
    }
    async deleteCommentById(id: string) {
        const deletionResult = await CommentsModel.deleteOne({id: id})
        return deletionResult.deletedCount;
    }
    async updateCommentById(commentId: string, content: string) {
        const resultOfChange = await CommentsModel.updateOne({id: commentId}, {$set: {content: content}})
        return resultOfChange.modifiedCount;
    }
    async addLikeOrDislike(commentId: string, likeStatus: string, userId: string) {
        await this.commentsRepository.likeOrDislikeComment(commentId, likeStatus, userId);
        return;
    }
}