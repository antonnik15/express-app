import {blogsCollection} from "../db";
import {ObjectId, SortDirection} from "mongodb";


export const blogsQueryRepository = {
    async findAllBlogs(queryParams: queryObj) {
        let filter: any = {};
        if (queryParams.searchNameTerm) {
            filter.name = {$regex: queryParams.searchNameTerm}
        }
        const countOfSkipElem = (queryParams.pageNumber - 1) * queryParams.pageSize
        const dbBlogs: DbBlogType[] = await blogsCollection.find(filter)
            .sort({[queryParams.sortBy] : queryParams.sortDirection})
            .skip(countOfSkipElem)
            .limit(queryParams.pageSize).toArray()

        const blogArray: OutPutBlogType[] = dbBlogs.map((blog: DbBlogType) => {
            return this.mapDbBlogTypeToOutputBlogType(blog)
        })
        return {
            pagesCount: Math.ceil(await blogsCollection.count({}) / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: await blogsCollection.count({}),
            items: blogArray
        }
    },
    async findBlogById(id: string): Promise<OutPutBlogType | undefined> {
        const blogById: DbBlogType | null = await blogsCollection.findOne({id: id})
        if(blogById) {
            return this.mapDbBlogTypeToOutputBlogType(blogById)
        }
    },
    mapDbBlogTypeToOutputBlogType(dbBlog: DbBlogType): OutPutBlogType {
        return {
            id: dbBlog.id,
            name: dbBlog.name,
            youtubeUrl: dbBlog.youtubeUrl,
            createdAt: dbBlog.createdAt
        }
    }
}

type OutPutBlogType ={
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}

type DbBlogType ={
    _id: ObjectId
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}

export type queryObj = {
    searchNameTerm?: string | null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}