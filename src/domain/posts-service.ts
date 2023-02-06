import {PostsRepository} from "../repositories/posts-repositories/posts-repository";
import {CommentsType, DbCommentsType, PostsType, UserType} from "../repositories/mongoose/types";
import {ObjectId} from "mongodb";
import {PostsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {
    constructor(@inject('PostsRepository') public postsRepository: PostsRepository,
                @inject('PostsQueryRepository') public postsQueryRepository: PostsQueryRepository) {
    }
    async createPost(title: string, shortDescription: string, content: string, blogId: string) : Promise<string> {

        const newPost: PostsType = new PostsType((+new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            'Travelling',
            new Date().toISOString(),
             {
                    "likesCount": 0,
                    "dislikesCount": 0,
                    "myStatus": "None",
                    "newestLikes": []
                })

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
        const newComment: DbCommentsType = new DbCommentsType(
            new ObjectId(),
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
        return this.postsQueryRepository.mapDbCommentsToOutputCommentsType(newComment, user.id);
    }

    async addLikeOrDislikeForPost(postId: string, likeStatus: string, userId: string, userLogin: string) {
        await this.postsRepository.likeOrDislikePost(postId, likeStatus, userId, userLogin);
        return;
    }
}