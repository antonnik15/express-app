import {blogsCollection, BlogsType} from "../db";


export const blogsRepository = {
    async createNewBlogs(blog: BlogsType): Promise<string> {
        await blogsCollection.insertOne(blog)
        return blog.id
    },
   async updateBlogById(id: string, name: string, youtubeUrl: string) : Promise<number> {
        const result = await blogsCollection.updateOne({id: id},
            {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.modifiedCount;
    },
    async deleteBlogsById(id: string) : Promise<number> {
        const resultOfDelete = await blogsCollection.deleteOne({id: id});
        return resultOfDelete.deletedCount;
    }
}