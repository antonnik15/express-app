import {PostsRepository} from "../repositories/posts-repositories/posts-repository";
import {CommentsType, PostsType, UserType} from "../repositories/mongoose/types";

export class PostsService {
    constructor(public postsRepository: PostsRepository) {
    }
    async createPost(title: string, shortDescription: string, content: string, blogId: string) : Promise<string> {

        const newPost: PostsType = new PostsType((+new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            'Travelling',
            new Date().toISOString())

        await this.postsRepository.createPost(newPost);
        return newPost.id;
    }
    async updatePostById(id: string, title: string,
                         shortDescription: string,
                         content: string, blogId: string) : Promise<number>{

        return await this.postsRepository.updatePost(id, title, shortDescription, content, blogId)

    }
    async deletePostById(id: string) : Promise<number>{
        return this.postsRepository.deletePostById(id)
    }

    async createNewCommentForPost(postId: string,
                                  content: string,
                                  user: UserType): Promise<CommentsType> {
        const newComment: CommentsType = new CommentsType(
            (+new Date()).toString(),
            content,
            {userId: user.id, userLogin: user.login},
            new Date().toISOString(),
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            },
            postId)

        await this.postsRepository.createNewCommentForPost({...newComment});
        delete newComment.postId;
        return newComment
    }
}