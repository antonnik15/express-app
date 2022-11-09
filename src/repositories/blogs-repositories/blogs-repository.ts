import {blogsCollection, BlogsType} from "../db";


export const blogsRepository = {
    async createNewBlogs(blog: BlogsType): Promise<BlogsType | null> {
        await blogsCollection.insertOne(blog)
        return blogsCollection.findOne({id: blog.id}, {projection: {_id: 0}})
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