import {CommentsModel} from "../repositories/mongoose/mongoose-schemes";

export const commentsService = {
    async deleteCommentById(id: string) {
        const deletionResult = await CommentsModel.deleteOne({id: id})
        return deletionResult.deletedCount;
    },
    async updateCommentById(commentId: string, content: string) {
        const resultOfChange = await CommentsModel.updateOne({id: commentId}, {$set: {content: content}})
        return resultOfChange.modifiedCount;
    }
}