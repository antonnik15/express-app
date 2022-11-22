import {commentsCollection, CommentsType, postsCollection, PostsType} from "../db";

export const postsRepository = {
    async createPost(post: PostsType) {
        await postsCollection.insertOne(post)
        return;
    },
    async updatePost(id: string, title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<number> {

        const resultOfChange = await postsCollection.updateOne({id: id},
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
        const deletionResult = await postsCollection.deleteOne({id: id})
        return deletionResult.deletedCount;
    },
    async createNewCommentForPost(comment: CommentsType) {
        await commentsCollection.insertOne(comment)
        return;
    }
}

