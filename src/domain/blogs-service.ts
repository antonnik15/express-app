import {BlogsRepository} from "../repositories/blogs-repositories/blogs-repository";
import {BlogType} from "../repositories/mongoose/types";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(@inject('BlogsRepository') public blogsRepository: BlogsRepository) {
    }
    async createNewBlogs(name: string, description: string, websiteUrl: string): Promise<string> {
        const newBlogs: BlogType = new BlogType((+new Date()).toString(), name, description, websiteUrl, new Date().toISOString())

        await this.blogsRepository.createNewBlogs(newBlogs);
        return newBlogs.id;
    }

    async updateBlogById(id: string, name: string,
                         description: string,
                         websiteUrl: string): Promise<number> {

        return this.blogsRepository.updateBlogById(id, name, description, websiteUrl)

    }

    async deleteBlogsById(id: string): Promise<number> {
        return this.blogsRepository.deleteBlogsById(id)
    }
}