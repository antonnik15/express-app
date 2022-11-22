import {blogsRepository} from "../repositories/blogs-repositories/blogs-repository";

export const blogsService = {
    async createNewBlogs(name: string,  description: string, websiteUrl: string) : Promise<string> {
        const newBlogs = {
            id: (+new Date()).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: (new Date()).toISOString()
        }
        await blogsRepository.createNewBlogs(newBlogs);
        return newBlogs.id;
    },
    async updateBlogById(id: string, name: string,
                         description: string,
                         websiteUrl: string): Promise<number> {

        return blogsRepository.updateBlogById(id, name, description, websiteUrl)

    },
    async deleteBlogsById(id: string): Promise<number> {
        return blogsRepository.deleteBlogsById(id)
    }
}