import {blogsCollection, BlogsType} from "./db";


export const blogsRepository = {
    async getAllBlogs(): Promise<BlogsType[]> {
        return blogsCollection.find({}, {projection: {_id: 0}}).toArray()
    },
    async createNewBlogs(name: string, youtubeUrl: string) : Promise<BlogsType | null> {
        const newBlogs = {
            id: (+new Date()).toString(),
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: (new Date()).toISOString()
        }
        await blogsCollection.insertOne(newBlogs)
        return await blogsCollection.findOne({name: name}, {projection: {_id: 0}})
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return await blogsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
   async updateBlogById(id: string, name: string, youtubeUrl: string) : Promise<number> {
        const result = await blogsCollection.updateOne({id: id},
            {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.modifiedCount;
    },
    async deleteBlogsById(id: string) : Promise<number> {
        const resultOfDelete = await blogsCollection.deleteOne({id: id})
        return resultOfDelete.deletedCount;
    }
}