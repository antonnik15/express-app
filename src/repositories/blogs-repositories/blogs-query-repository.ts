import {blogsCollection, BlogsType} from "../db";


export const blogsQueryRepository = {
    async findAllBlogs(): Promise<BlogsType[]> {
        return await blogsCollection.find({}, {projection: {_id: 0}}).toArray()
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return await blogsCollection.findOne({id: id}, {projection: {_id: 0}})
    }
}