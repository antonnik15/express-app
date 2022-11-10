import {postsRepository} from "../repositories/posts-repositories/posts-repository";
import {QueryObjectType} from "../repositories/blogs-repositories/blogs-query-repository";


export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string) : Promise<string> {
        const newPost = {
            id: (+new Date()).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: "Travelling",
            createdAt: (new Date()).toISOString()
        }
        return await postsRepository.createPost(newPost)
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) : Promise<number>{
        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },
    async deletePostById(id: string) : Promise<number>{
        return postsRepository.deletePostById(id)
    },
    async createPostForCertainBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<string> {
        const newPost= {
            id: (+new Date()).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: "Travelling",
            createdAt: (new Date()).toISOString()
        }
        return await postsRepository.createPost(newPost)
    },
    createQueryBlogsObject(query: any): QueryObjectType {
        return {
            pageNumber: (query.pageNumber) ? +query.pageNumber : 1,
            pageSize: (query.pageSize) ? +query.pageSize : 10,
            sortBy: (query.sortBy) ? query.sortBy.toString() : "createdAt",
            sortDirection: (query.sortDirection === 'asc') ? 'asc' : 'desc'
        }
    }
}
