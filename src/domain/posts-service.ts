import {postsRepository} from "../repositories/posts-repositories/posts-repository";
import {QueryObjectType} from "../repositories/blogs-repositories/blogs-query-repository";
import {OutPutUsersType} from "../repositories/users-repositories/users-query-repository";
import {CommentsType} from "../repositories/db";


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
    createQueryBlogsObject(query: any): QueryObjectType {
        return {
            pageNumber: (query.pageNumber) ? query.pageNumber : '1',
            pageSize: (query.pageSize) ? query.pageSize : '10',
            sortBy: (query.sortBy) ? query.sortBy.toString() : "createdAt",
            sortDirection: (query.sortDirection === 'asc') ? 'asc' : 'desc'
        }
    },
    async createCommentForPost(postId: string, content: string, user: OutPutUsersType): Promise<CommentsType> {
        const newComment: CommentsType = {
            id: postId,
            content: content,
            userId: user.id,
            userLogin: user.login,
            createdAt: new Date().toISOString()
        }
        await postsRepository.createCommentForPost(newComment);
        return newComment;
    }
}
