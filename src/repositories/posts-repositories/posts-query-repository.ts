import {
    CommentsType,
    DbCommentsType,
    DbPostType,
    OutputObjectType,
    PostsType,
    QueryParamsTypeForPost, UserType
} from "../mongoose/types";
import {CommentsModel, LikesModel, PostsModel} from "../mongoose/mongoose-schemes";

export class PostsQueryRepository {
    async findAllPosts(query: any) {
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

        const postsArray: PostsType[] = dbPosts.map((post) => this.mapDbPostToOutPutPostType(post))

        return await this.createOutputObject({}, queryParamsObject, postsArray, PostsModel)
    }

    async findPostById(id: string): Promise<PostsType | undefined> {
        const postById: DbPostType | null =  await PostsModel.findOne({id: id})
        if(postById) {
            return this.mapDbPostToOutPutPostType(postById)
        }
        return;
    }

    async findPostsForCertainBlog(blogId: string, query: any):  Promise<OutputObjectType> {
        const queryParamsObject: QueryParamsTypeForPost = this._createQueryPostsObject(query)

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbPostsForCertainBlog: DbPostType[] = await PostsModel
            .find({blogId: blogId})
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize)
            .lean()

        const postsArray: PostsType[] = dbPostsForCertainBlog.map(post => this.mapDbPostToOutPutPostType(post))

        return await this.createOutputObject({blogId: blogId}, queryParamsObject, postsArray, PostsModel)
    }

    async findCommentsForCertainPost(postId: string, query: any, user: any): Promise<OutputObjectType> {
        const queryParamsObject: QueryParamsTypeForPost = this._createQueryPostsObject(query);

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbCommentsForCertainPost: DbCommentsType[] = await CommentsModel
            .find({postId: postId})
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize).lean();

        const commentsArray: Promise<CommentsType>[] = dbCommentsForCertainPost.map(comment => this.mapDbCommentsToOutputCommentsType(comment, user))

        return await this.createOutputObject({postId: postId}, queryParamsObject, commentsArray, CommentsModel)
    }
    _createQueryPostsObject(query: any): QueryParamsTypeForPost {
        return new QueryParamsTypeForPost(
            (query.pageNumber) ? query.pageNumber : '1',
            (query.pageSize) ? query.pageSize : '10',
            (query.sortBy) ? query.sortBy : "createdAt",
            query.sortDirection ? query.sortDirection  : 'desc')


    }
    mapDbPostToOutPutPostType(dbPost: DbPostType) {
        return {
            id: dbPost!.id,
            title: dbPost!.title,
            shortDescription: dbPost!.shortDescription,
            content: dbPost!.content,
            blogId: dbPost!.blogId,
            blogName: dbPost!.blogName,
            createdAt: dbPost!.createdAt
        }
    }

    async createOutputObject(filter: Object,
                             queryParams: QueryParamsTypeForPost,
                             array: PostsType[] | Promise <CommentsType>[] | UserType[],
                             collection: any): Promise<OutputObjectType>{
        return new OutputObjectType(
            Math.ceil(await collection.count(filter) / +queryParams.pageSize),
            +queryParams.pageNumber,
            +queryParams.pageSize,
            await collection.count(filter),
            array)
    }

    async mapDbCommentsToOutputCommentsType(dbComments: DbCommentsType, user: any): Promise<CommentsType> {
        const totalLikes = await LikesModel.countDocuments({$and: [{commentId: dbComments.id}, {likeStatus: "Like"}]})
        const totalDislikes = await LikesModel.countDocuments({$and: [{commentId: dbComments.id}, {likeStatus: "Dislike"}]})
        const likeStatus = await LikesModel.findOne({$and: [{commentId: dbComments.id}, {userId: user.id}]})
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