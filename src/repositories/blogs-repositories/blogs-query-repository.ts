import {blogsCollection} from "../db";
import {ObjectId} from "mongodb";


export const blogsQueryRepository = {
    async findAllBlogs(): Promise<outputBlogType[]> {
        const dbBlogs: DbBlogType[] = await blogsCollection.find({}).toArray()
        dbBlogs.map(blog => {
            mapDbBlogTypeToOutputBlogType(blog)
        })
        return dbBlogs;
    },
    async findBlogById(id: string): Promise<outputBlogType | null> {
        const blogById: DbBlogType | null = await blogsCollection.findOne({id: id})
        return mapDbBlogTypeToOutputBlogType(blogById!)
    }
}
const mapDbBlogTypeToOutputBlogType = (dbBlog: DbBlogType): outputBlogType => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        youtubeUrl: dbBlog.youtubeUrl,
        createdAt: dbBlog.createdAt
    }
}
type outputBlogType ={
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}
type DbBlogType ={
    _id: ObjectId
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}