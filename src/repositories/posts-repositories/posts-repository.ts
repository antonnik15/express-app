import {postsCollection, PostsType} from "../db";

export const postsRepository = {
    async createPost(post: PostsType) : Promise<PostsType | null> {
        await postsCollection.insertOne(post)
        return await postsCollection.findOne({id: post.id},{projection: {_id: 0}})
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) : Promise<number>{
        const resultOfUpdatingPost = await postsCollection.updateOne({id: id},
            {$set: {title: title, shortDescription: shortDescription,
                    content: content, blogId: blogId}})
        return resultOfUpdatingPost.modifiedCount;
    },
    async deletePostById(id: string) : Promise<number>{
        const resultOfDelete = await postsCollection.deleteOne({id: id})
        return resultOfDelete.deletedCount;
    }
}


