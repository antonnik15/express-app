import {blogsCollection} from "../db";
import {ObjectId, SortDirection} from "mongodb";


export const blogsQueryRepository = {
    async findAllBlogs(query: any) {
        const queryParamsObject: QueryParamsType = this._createQueryParamsObject(query)

        let filter: any = {};
        if (queryParamsObject.searchNameTerm) {
            filter.name = {$regex: queryParamsObject.searchNameTerm, $options: "i"}
        }

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize)

        const dbBlogs: DbBlogType[] = await blogsCollection
            .find(filter)
            .sort({[queryParamsObject.sortBy] : queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize).toArray()

        const blogsArray: OutputBlogType[] = dbBlogs.map((blog: DbBlogType) => this.mapDbBlogTypeToOutputBlogType(blog))

        return {
            pagesCount: Math.ceil(await blogsCollection.count(filter, {}) / (+queryParamsObject.pageSize)),
            page: +queryParamsObject.pageNumber,
            pageSize: +queryParamsObject.pageSize,
            totalCount: await blogsCollection.count(filter, {}),
            items: blogsArray
        }
    },

    async findBlogById(id: string): Promise<OutputBlogType | undefined> {
        const blogById: DbBlogType | null = await blogsCollection.findOne({id: id})
        if (blogById) return this.mapDbBlogTypeToOutputBlogType(blogById)
    },

    _createQueryParamsObject(query: any): QueryParamsType {
        return {
            searchNameTerm: (query.searchNameTerm) ? query.searchNameTerm : null,
            pageNumber: (query.pageNumber) ? query.pageNumber : '1',
            pageSize: (query.pageSize) ? query.pageSize : '10',
            sortBy: (query.sortBy) ? query.sortBy : "createdAt",
            sortDirection: query.sortDirection ? query.sortDirection : 'desc'
        }
    },
    mapDbBlogTypeToOutputBlogType(dbBlog: DbBlogType): OutputBlogType {
        return {
            id: dbBlog.id,
            name: dbBlog.name,
            description: dbBlog.description,
            websiteUrl: dbBlog.websiteUrl,
            createdAt: dbBlog.createdAt
        }
    }
}

type OutputBlogType ={
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

export type QueryParamsType = {
    searchNameTerm?: string | null
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}