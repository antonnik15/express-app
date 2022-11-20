import {commentsCollection} from "../repositories/db";


export const commentsService = {
    async deleteCommentById(id: string) {
        const resultOfDeleting = await commentsCollection.deleteOne({id: id})
        return resultOfDeleting.deletedCount;
    },
    async updateCommentById(commentId: string, content: string) {
        const resultOfUpdating = await commentsCollection.updateOne({id: commentId}, {$set: {content: content}})
        return resultOfUpdating.modifiedCount;
    }
}