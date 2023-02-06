import {DbCommentsType, LikesType, LikesTypeForPost, PostsType} from "../mongoose/types";
import {CommentsModel, LikesModelForPost, PostsModel} from "../mongoose/mongoose-schemes";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {

    async createPost(post: PostsType) {
        await PostsModel.create(post)
        return;
    }
    async updatePost(id: string, title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<number> {

        const resultOfChange = await PostsModel.updateOne({id: id},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId
                }
            })

        return resultOfChange.modifiedCount;
    }

    async deletePostById(id: string): Promise<number> {
        const deletionResult = await PostsModel.deleteOne({id: id})
        return deletionResult.deletedCount;
    }
    async createNewCommentForPost(comment: DbCommentsType) {
        await CommentsModel.create(comment);
        return;
    }

    async likeOrDislikePost(commentId: string, likeStatus: string, userId: string, userLogin: string) {
        const existLikeStatus: LikesType | null = await LikesModelForPost.findOne({$and: [{userId: userId}, {commentId: commentId}]})

        if (!existLikeStatus) {
            const like: LikesTypeForPost = new LikesTypeForPost(userId, commentId, likeStatus, userLogin)
            await LikesModelForPost.create(like)
            return;
        }
        if (existLikeStatus) {
            if (existLikeStatus.userLikeStatus === likeStatus) {
                return;
            } else {
                await LikesModelForPost.updateOne({userId: userId, commentId: commentId}, {$set: {userLikeStatus: likeStatus, addedAt: new Date().toISOString()}});
                return;
            }
        }
    }
}

