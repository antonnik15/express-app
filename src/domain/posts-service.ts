import {postsRepository} from "../repositories/posts-repositories/posts-repository";
import {CommentsType, UserType} from "../repositories/mongoose/types";

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
        await postsRepository.createPost(newPost);
        return newPost.id;
    },
    async updatePostById(id: string, title: string,
                         shortDescription: string,
                         content: string, blogId: string) : Promise<number>{

        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)

    },
    async deletePostById(id: string) : Promise<number>{
        return postsRepository.deletePostById(id)
    },

    async createNewCommentForPost(postId: string,
                                  content: string,
                                  user: UserType): Promise<CommentsType> {
        const newComment: CommentsType = {
            id: (+new Date()).toString(),
            content: content,
            userId: user.id,
            userLogin: user.login,
            createdAt: new Date().toISOString(),
            postId: postId
        }
        await postsRepository.createNewCommentForPost({...newComment});
        delete newComment.postId;
        return newComment
    }
}
