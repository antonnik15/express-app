import {blogsCollection} from "../db";
import {ObjectId} from "mongodb";


export const blogsQueryRepository = {
    async findAllBlogs(): Promise<outputBlogType[]> {
        const dbBlogs: DbBlogType[] = await blogsCollection.find({}).toArray()
        return dbBlogs.map((blog: DbBlogType) => {
            return this.mapDbBlogTypeToOutputBlogType(blog)
        })
    },
    async findBlogById(id: string): Promise<outputBlogType | undefined> {
        const blogById: DbBlogType | null = await blogsCollection.findOne({id: id})
        if(blogById) {
            return this.mapDbBlogTypeToOutputBlogType(blogById)
        }
    },
    mapDbBlogTypeToOutputBlogType(dbBlog: DbBlogType): outputBlogType {
        return {
            id: dbBlog.id,
            name: dbBlog.name,
            youtubeUrl: dbBlog.youtubeUrl,
            createdAt: dbBlog.createdAt
        }
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