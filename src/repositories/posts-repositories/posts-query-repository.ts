import {commentsCollection, postsCollection} from "../db";
import {Collection, ObjectId, SortDirection} from "mongodb";

export const postsQueryRepository = {

    async findAllPosts(query: any) {
        const queryParamsObject: QueryParamsType = this._createQueryPostsObject(query);

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbPosts: DbPostType[] = await postsCollection
            .find({})
            .sort((queryParamsObject.sortBy !== "blogName")
                ? {[queryParamsObject.sortBy]: queryParamsObject.sortDirection}
                : {"createdAt": queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize)
            .toArray()

        const postsArray: OutPutPostType[] = dbPosts.map((post) => this.mapDbPostToOutPutPostType(post))

        return await this.createOutputObject({}, queryParamsObject, postsArray, postsCollection)
    },

    async findPostById(id: string): Promise<OutPutPostType | undefined> {
        const postById: DbPostType | null =  await postsCollection.findOne({id: id})
        if(postById) {
            return this.mapDbPostToOutPutPostType(postById)
        }
        return;
    },

    async findPostsForCertainBlog(blogId: string, query: any) {
        const queryParamsObject: QueryParamsType = this._createQueryPostsObject(query)

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbPostsForCertainBlog: DbPostType[] = await postsCollection
            .find({blogId: blogId})
            .sort(queryParamsObject.sortBy, queryParamsObject.sortDirection)
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize).toArray()

        const postsArray: OutPutPostType[] = dbPostsForCertainBlog.map(post => this.mapDbPostToOutPutPostType(post))

        return await this.createOutputObject({blogId: blogId}, queryParamsObject, postsArray, postsCollection)
    },

    async findCommentsForCertainPost(postId: string, query: any) {
        const queryParamsObject: QueryParamsType = this._createQueryPostsObject(query);

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize);

        const dbCommentsForCertainPost: DbCommentsType[] = await commentsCollection
            .find({postId: postId})
            .sort({[queryParamsObject.sortBy]: queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize).toArray()

        const commentsArray: OutputCommentsType[] = dbCommentsForCertainPost.map(comment => this.mapDbCommentsToOutputCommentsType(comment))

        return await this.createOutputObject({postId: postId}, queryParamsObject, commentsArray, commentsCollection)
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
                             array: OutPutPostType[] | OutputCommentsType[],
                             collection: Collection<any>): Promise<OutputObjectType>{
        return {
            pagesCount: Math.ceil(await collection.count(filter) / +queryParams.pageSize),
            page: +queryParams.pageNumber,
            pageSize: +queryParams.pageSize,
            totalCount: await collection.count(filter),
            items: array
        }
    },
    mapDbCommentsToOutputCommentsType(dbComments: DbCommentsType): OutputCommentsType {
        return {
            id: dbComments.id,
            content: dbComments.content,
            userId: dbComments.userId,
            userLogin: dbComments.userLogin,
            createdAt: dbComments.createdAt,
        }
    }

}
type QueryParamsType = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}

type DbPostType = {
    _id: ObjectId
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
type OutPutPostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

type OutputObjectType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<OutPutPostType | OutputCommentsType>
}

type DbCommentsType = {
    _id: ObjectId
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId?: string
}

type OutputCommentsType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}