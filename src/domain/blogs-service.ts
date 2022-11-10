import {blogsRepository} from "../repositories/blogs-repositories/blogs-repository";
import {QueryObjectType} from "../repositories/blogs-repositories/blogs-query-repository";

export const blogsService = {
    async createNewBlogs(name: string, youtubeUrl: string) : Promise<string> {
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
    },
    createQueryBlogsObject(query: any): QueryObjectType {
        return {
            searchNameTerm: (query.searchNameTerm) ? query.searchNameTerm.toString() : null,
            pageNumber: (query.pageNumber) ? +query.pageNumber : 1,
            pageSize: (query.pageSize) ? +query.pageSize : 10,
            sortBy: (query.sortBy) ? query.sortBy.toString() : "createdAt",
            sortDirection: (query.sortDirection === 'asc') ? 'asc' : 'desc'
        }
    }
}