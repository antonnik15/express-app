import {commentsCollection} from "../repositories/db";


export const commentsService = {
    async deleteCommentById(id: string) {
        const deletionResult = await commentsCollection.deleteOne({id: id})
        return deletionResult.deletedCount;
    },
    async updateCommentById(commentId: string, content: string) {
        const resultOfChange = await commentsCollection.updateOne({id: commentId}, {$set: {content: content}})
        return resultOfChange.modifiedCount;
    }
}