import {postsCollection, PostsType} from "./db";

export const postsRepository = {
    async getAllPosts(): Promise<PostsType[]> {
        return await postsCollection.find({}).toArray()
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) : Promise<PostsType | null> {
        const newPost = {
            id: (+new Date()).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: "Travelling",
            createdAt: (new Date()).toISOString()
        }
        const resultOfCreatingPost = postsCollection.insertOne(newPost)
        return await postsCollection.findOne({title: title})
    },
    async findPostById(id: string): Promise<PostsType | null> {
        const post = await postsCollection.findOne({id: id})
        return post
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


