import {
    CommentsType,
    DbCommentsType,
    DbPostType,
    OutputObjectType,
    PostsType,
    QueryParamsType
} from "../mongoose/types";
import {CommentsModel, PostsModel} from "../mongoose/mongoose-schemes";

export const postsQueryRepository = {

    async findAllPosts(query: any) {
        const queryParamsObject: QueryParamsType = this._createQueryPostsObject(query);

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
    },

    async findPostById(id: string): Promise<PostsType | undefined> {
        const postById: DbPostType | null =  await PostsModel.findOne({id: id})
        if(postById) {
            return this.mapDbPostToOutPutPostType(postById)
        }
        return;
    },

    async findPostsForCertainBlog(blogId: string, query: any) {
        const queryParamsObject: QueryParamsType = this._createQueryPostsObject(query)

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbPostsForCertainBlog: DbPostType[] = await PostsModel
            .find({blogId: blogId})
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize)
            .lean()

        const postsArray: PostsType[] = dbPostsForCertainBlog.map(post => this.mapDbPostToOutPutPostType(post))

        return await this.createOutputObject({blogId: blogId}, queryParamsObject, postsArray, PostsModel)
    },

    async findCommentsForCertainPost(postId: string, query: any) {
        const queryParamsObject: QueryParamsType = this._createQueryPostsObject(query);

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbCommentsForCertainPost: DbCommentsType[] = await CommentsModel
            .find({postId: postId})
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize).lean();

        const commentsArray: CommentsType[] = dbCommentsForCertainPost.map(comment => this.mapDbCommentsToOutputCommentsType(comment))

        return await this.createOutputObject({postId: postId}, queryParamsObject, commentsArray, CommentsModel)
    },
    _createQueryPostsObject(query: any): QueryParamsType {
        return {
            pageNumber: (query.pageNumber) ? query.pageNumber : '1',
            pageSize: (query.pageSize) ? query.pageSize : '10',
            sortBy: (query.sortBy) ? query.sortBy : "createdAt",
            sortDirection: query.sortDirection ? query.sortDirection  : 'desc'
        }
    },
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
    },

    async createOutputObject(filter: Object,
                             queryParams: QueryParamsType,
                             array: PostsType[] | CommentsType[],
                             collection: any): Promise<OutputObjectType>{
        return {
            pagesCount: Math.ceil(await collection.count(filter) / +queryParams.pageSize),
            page: +queryParams.pageNumber,
            pageSize: +queryParams.pageSize,
            totalCount: await collection.count(filter),
            items: array
        }
    },
    mapDbCommentsToOutputCommentsType(dbComments: DbCommentsType): CommentsType {
        return {
            id: dbComments.id,
            content: dbComments.content,
            userId: dbComments.userId,
            userLogin: dbComments.userLogin,
            createdAt: dbComments.createdAt,
        }
    }

}
