import {
    CommentsType,
    DbCommentsType,
    DbPostType, LikesTypeForPost,
    OutputObjectType,
    PostsType,
    QueryParamsTypeForPost, UserType
} from "../mongoose/types";
import {CommentsModel, LikesModelForComment, LikesModelForPost, PostsModel} from "../mongoose/mongoose-schemes";
import {injectable} from "inversify";

@injectable()
export class PostsQueryRepository {
    async findAllPosts(query: any, userId: string) {
        const queryParamsObject: QueryParamsTypeForPost = this._createQueryPostsObject(query);

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbPosts: DbPostType[] = await PostsModel
            .find({})
            .sort((queryParamsObject.sortBy !== "blogName")
                ? {[queryParamsObject.sortBy]: queryParamsObject.sortDirection}
                : {"createdAt": queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize)
            .lean()

        const postsArray: Awaited<PostsType>[] = await Promise.all( dbPosts.map((post) => this.mapDbPostToOutPutPostType(post, userId)))

        return await this.createOutputObject({}, queryParamsObject, postsArray, PostsModel)
    }

    async findPostById(id: string, userId: string): Promise<PostsType | undefined> {
        const postById: DbPostType | null =  await PostsModel.findOne({id: id})
        if(postById) {
            return this.mapDbPostToOutPutPostType(postById, userId)
        }
        return;
    }

    async findPostsForCertainBlog(blogId: string, query: any, userId: string | undefined):  Promise<OutputObjectType> {
        const queryParamsObject: QueryParamsTypeForPost = this._createQueryPostsObject(query)

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbPostsForCertainBlog: DbPostType[] = await PostsModel
            .find({blogId: blogId})
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize)
            .lean()

        const postsArray: Awaited<PostsType>[] = await Promise.all( dbPostsForCertainBlog.map((post) => this.mapDbPostToOutPutPostType(post, userId)))

        return await this.createOutputObject({blogId: blogId}, queryParamsObject, postsArray, PostsModel)
    }

    async findCommentsForCertainPost(postId: string, query: any, userId: string | undefined): Promise<OutputObjectType> {
        const queryParamsObject: QueryParamsTypeForPost = this._createQueryPostsObject(query);

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbCommentsForCertainPost: DbCommentsType[] = await CommentsModel
            .find({postId: postId})
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize).lean();
        const commentsArray: Awaited<CommentsType>[] = await Promise.all(dbCommentsForCertainPost.map((comment) => this.mapDbCommentsToOutputCommentsType(comment, userId)))

        return await this.createOutputObject({postId: postId}, queryParamsObject, commentsArray, CommentsModel)
    }
    _createQueryPostsObject(query: any): QueryParamsTypeForPost {
        return new QueryParamsTypeForPost(
            (query.pageNumber) ? query.pageNumber : '1',
            (query.pageSize) ? query.pageSize : '10',
            (query.sortBy) ? query.sortBy : "createdAt",
            query.sortDirection ? query.sortDirection  : 'desc')


    }

    async mapDbPostToOutPutPostType(dbPost: DbPostType, userId: string | undefined) {
        const totalLikes = await LikesModelForPost.countDocuments({postId: dbPost.id, userLikeStatus: 'Like'})
        const totalDislikes = await LikesModelForPost.countDocuments({postId: dbPost.id, userLikeStatus: "Dislike"})
        const likeStatus = await LikesModelForPost.findOne({$and: [{postId: dbPost.id}, {userId: userId}]});
        let lastLikes: LikesTypeForPost[] = await LikesModelForPost.find({postId: dbPost.id})
        lastLikes = lastLikes.sort((a, b) => +a.addedAt - (+b.addedAt))
        while (lastLikes.length > 3) {
            lastLikes.pop()
        }
        const lastThreeLikes = lastLikes.map(l => {
            return {addedAt: l.addedAt, userId: l.userId, login: l.login}
        })
        return new PostsType(
            dbPost!.id,
            dbPost!.title,
            dbPost!.shortDescription,
            dbPost!.content,
            dbPost!.blogId,
            dbPost!.blogName,
            dbPost!.createdAt,
            {
                likesCount: totalLikes,
                dislikesCount: totalDislikes,
                myStatus: (likeStatus) ? likeStatus.userLikeStatus : "None",
                newestLikes: lastThreeLikes
            })
    }



    async createOutputObject(filter: Object,
                             queryParams: QueryParamsTypeForPost,
                             array: Awaited<PostsType>[] | PostsType[] | Awaited<CommentsType>[] | UserType[],
                             collection: any): Promise<OutputObjectType>{
        return new OutputObjectType(
            Math.ceil(await collection.count(filter) / +queryParams.pageSize),
            +queryParams.pageNumber,
            +queryParams.pageSize,
            await collection.count(filter),
            array)
    }

    async mapDbCommentsToOutputCommentsType(dbComments: DbCommentsType, userId: string | undefined): Promise<CommentsType> {
        const totalLikes = await LikesModelForComment.countDocuments({commentId: dbComments.id, userLikeStatus: 'Like'})
        const totalDislikes = await LikesModelForComment.countDocuments({commentId: dbComments.id, userLikeStatus: "Dislike"})
        const likeStatus = await LikesModelForComment.findOne({$and: [{commentId: dbComments.id}, {userId: userId}]});
        return new CommentsType(
            dbComments.id,
            dbComments.content,
            {userId: dbComments.commentatorInfo.userId, userLogin: dbComments.commentatorInfo.userLogin},
            dbComments.createdAt,
            {
                likesCount: totalLikes,
                dislikesCount: totalDislikes,
                myStatus: (likeStatus) ? likeStatus.userLikeStatus : "None"
            });
    }
}