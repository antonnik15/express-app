import {blogsRepository} from "../repositories/blogs-repositories/blogs-repository";
import {BlogsType} from "../repositories/db";


export const blogsService = {
    async createNewBlogs(name: string, youtubeUrl: string) : Promise<BlogsType | null> {
        const newBlogs = {
            id: (+new Date()).toString(),
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: (new Date()).toISOString()
        }
        return await blogsRepository.createNewBlogs(newBlogs)
    },
    async updateBlogById(id: string, name: string, youtubeUrl: string) : Promise<number> {
        return blogsRepository.updateBlogById(id, name, youtubeUrl)
    },
    async deleteBlogsById(id: string) : Promise<number> {
        return blogsRepository.deleteBlogsById(id)
    }
}