import {commentsCollection, postsCollection} from "../db";
import {ObjectId, SortDirection} from "mongodb";

export const postsQueryRepository = {

    async findAllPosts(queryParams: queryObj) {
        const countOfSkipElem = (+queryParams.pageNumber - 1) * (+queryParams.pageSize);
        const dbPosts: DbPostType[] = await postsCollection
            .find({})
            .sort((queryParams.sortBy !== "blogName") ? {[queryParams.sortBy]: queryParams.sortDirection}
                : {"createdAt": queryParams.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParams.pageSize)
            .toArray()
        const postsArrayOutput: OutPutPostType[] = dbPosts.map((post) => {
            return this.mapDbPostToOutPutPostType(post)
        })
        return await this.createPostOutputObject({}, queryParams, postsArrayOutput)
    },

    async findPostById(id: string): Promise<OutPutPostType | undefined> {
        const dbPostById: DbPostType | null =  await postsCollection.findOne({id: id})
        if(dbPostById) {
            return this.mapDbPostToOutPutPostType(dbPostById)
        }
    },

    async findPostsForCertainBlog(blogId: string, queryParams: queryObj) {
        const countOfSkipElem = (+queryParams.pageNumber - 1) * (+queryParams.pageSize);
        const dbCertainPosts: DbPostType[] = await postsCollection
            .find({blogId: blogId})
            .sort(queryParams.sortBy, queryParams.sortDirection)
            .skip(countOfSkipElem)
            .limit(+queryParams.pageSize).toArray()
        const postsArray: OutPutPostType[] = dbCertainPosts.map((post) => {
            return this.mapDbPostToOutPutPostType(post)
        })
        return this.createPostOutputObject({blogId: blogId}, queryParams, postsArray)
    },

    async findCommentsForCertainPost(postId: string, query: queryObj) {
        if (await this.findPostById(postId)) {
            const countOfSkipElem = (+query.pageNumber - 1) * (+query.pageSize);
            const dbCommentsForCertainPost: DbCommentsType[] = await commentsCollection.find({id: postId})
                .sort({[query.sortBy]: query.sortDirection})
                .skip(countOfSkipElem)
                .limit(+query.pageSize).toArray()
            return {
                pagesCount: Math.ceil(await commentsCollection.count({id: postId}) / +query.pageSize),
                page: +query.pageNumber,
                pageSize: +query.pageSize,
                totalCount: await commentsCollection.count({id: postId}),
                items: dbCommentsForCertainPost.map((comment) => this.mapDbCommentsToOutputCommentsType(comment))
            }
        }
        return;
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

    async createPostOutputObject(filter: Object, queryParams: queryObj, array: OutPutPostType[]): Promise<OutputObjectWithPaginationType>{
        return {
            pagesCount: Math.ceil(await postsCollection.find(filter)
                .count({}) / +queryParams.pageSize),
            page: +queryParams.pageNumber,
            pageSize: +queryParams.pageSize,
            totalCount: await postsCollection.find(filter).count({}),
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
type queryObj = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}

type OutputObjectWithPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<OutPutPostType>
}

type DbCommentsType = {
    _id: ObjectId
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}

type OutputCommentsType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}