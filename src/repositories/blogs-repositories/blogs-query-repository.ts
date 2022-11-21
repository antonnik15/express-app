import {blogsCollection} from "../db";
import {ObjectId, SortDirection} from "mongodb";


export const blogsQueryRepository = {
    async findAllBlogs(queryParams: QueryObjectType) {
        let filter: any = {};
        if (queryParams.searchNameTerm) {
            filter.name = {$regex: queryParams.searchNameTerm, $options: "i"}
        }
        const countOfSkipElem = (+queryParams.pageNumber - 1) * (+queryParams.pageSize)
        const dbBlogs: DbBlogType[] = await blogsCollection.find(filter)
            .sort({[queryParams.sortBy] : queryParams.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParams.pageSize).toArray()

        const blogArray: OutPutBlogType[] = dbBlogs.map((blog: DbBlogType) => {
            return this.mapDbBlogTypeToOutputBlogType(blog)
        })
        return {
            pagesCount: Math.ceil(await blogsCollection.find(filter).count({}) / (+queryParams.pageSize)),
            page: +queryParams.pageNumber,
            pageSize: +queryParams.pageSize,
            totalCount: await blogsCollection.find(filter).count({}),
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
            description: dbBlog.description,
            websiteUrl: dbBlog.websiteUrl,
            createdAt: dbBlog.createdAt
        }
    }
}

type OutPutBlogType ={
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

type DbBlogType ={
    _id: ObjectId
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type QueryObjectType = {
    searchNameTerm?: string | null
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}