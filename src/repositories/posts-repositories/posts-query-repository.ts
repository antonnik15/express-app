import {postsCollection} from "../db";
import {ObjectId, SortDirection} from "mongodb";

export const postsQueryRepository = {
    async findAllPosts(queryParams: queryObj) {
        const countOfSkipElem = (queryParams.pageNumber - 1) * queryParams.pageSize;

        const dbPosts: DbPostType[] = await postsCollection.find({}).skip(countOfSkipElem).limit(queryParams.pageSize)
            .sort(queryParams.sortBy, queryParams.sortDirection).toArray()
        const postsArrayOutput: OutPutPostType[] = dbPosts.map((post) => {
            return this.mapDbPostToOutPutPostType(post)
        })
        return {
            pagesCount: Math.ceil(await postsCollection.count({}) / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: postsCollection.count({}),
            items: postsArrayOutput
        }
    },
    async findPostById(id: string): Promise<OutPutPostType | undefined> {
        const dbPostById: DbPostType | null =  await postsCollection.findOne({id: id})
        if(dbPostById) {
            return this.mapDbPostToOutPutPostType(dbPostById)
        }
    },
    async findPostsForCertainBlog(blogId: string, queryParams: queryObj) {
        const countOfSkipElem = (queryParams.pageNumber - 1) * queryParams.pageSize;
        const dbCertainPosts: DbPostType[] = await postsCollection.find({blogId: blogId}).skip(countOfSkipElem)
            .limit(queryParams.pageSize).sort(queryParams.sortBy, queryParams.sortDirection).toArray()
        const postsArray: OutPutPostType[] = dbCertainPosts.map((post) => {
            return this.mapDbPostToOutPutPostType(post)
        })
        return {
            pagesCount: Math.ceil(await postsCollection.count({}) / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: postsCollection.count({}),
            items: postsArray
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
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}

