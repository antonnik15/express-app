import {CommentsType, PostsType} from "../mongoose/types";
import {CommentsModel, PostsModel} from "../mongoose/mongoose-schemes";

export const postsRepository = {
    async createPost(post: PostsType) {
        await PostsModel.create(post)
        return;
    },
    async updatePost(id: string, title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<number> {

        const resultOfChange = await PostsModel.updateOne({id: id},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId
                }
            })

        return resultOfChange.modifiedCount;
    },

    async deletePostById(id: string): Promise<number> {
        const deletionResult = await PostsModel.deleteOne({id: id})
        return deletionResult.deletedCount;
    },
    async createNewCommentForPost(comment: CommentsType) {
        await CommentsModel.create(comment);
        return;
    }
}

