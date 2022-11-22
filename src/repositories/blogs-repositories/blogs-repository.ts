import {blogsCollection, BlogsType} from "../db";


export const blogsRepository = {
    async createNewBlogs(blog: BlogsType) {
        await blogsCollection.insertOne(blog)
        return;
    },
   async updateBlogById(id: string, name: string,
                        description: string,
                        websiteUrl: string): Promise<number> {

       const resultOfChange = await blogsCollection.updateOne({id: id},
           {
               $set: {
                   name: name,
                   websiteUrl: websiteUrl,
                   description: description
               }
           })

       return resultOfChange.modifiedCount;
   },
    async deleteBlogsById(id: string): Promise<number> {
        const deletionResult = await blogsCollection.deleteOne({id: id});
        return deletionResult.deletedCount;
    }
}