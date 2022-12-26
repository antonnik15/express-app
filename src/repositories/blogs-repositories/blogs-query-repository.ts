import {BlogsType, DbBlogType, QueryParamsType} from "../mongoose/types";
import {BlogsModel} from "../mongoose/mongoose-schemes";


export const blogsQueryRepository = {
    async findAllBlogs(query: any) {
        const queryParamsObject: QueryParamsType = this._createQueryParamsObject(query)

        let filter: any = {};
        if (queryParamsObject.searchNameTerm) {
            filter.name = {$regex: queryParamsObject.searchNameTerm, $options: "i"}
        }

        const countOfSkipElem = (+queryParamsObject.pageNumber - 1) * (+queryParamsObject.pageSize)

        const dbBlogs: DbBlogType[] = await BlogsModel
            .find(filter)
            .sort({[queryParamsObject.sortBy] : queryParamsObject.sortDirection})
            .skip(countOfSkipElem)
            .limit(+queryParamsObject.pageSize).lean();

        const blogsArray: BlogsType[] = dbBlogs.map((blog: DbBlogType) => this.mapDbBlogTypeToOutputBlogType(blog))

        return {
            pagesCount: Math.ceil(await BlogsModel.count(filter) / (+queryParamsObject.pageSize)),
            page: +queryParamsObject.pageNumber,
            pageSize: +queryParamsObject.pageSize,
            totalCount: await BlogsModel.count(filter),
            items: blogsArray
        }
    },

    async findBlogById(id: string): Promise<BlogsType | undefined> {
        const blogById: DbBlogType | null = await BlogsModel.findOne({id: id})
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
    mapDbBlogTypeToOutputBlogType(dbBlog: DbBlogType): BlogsType {
        return {
            id: dbBlog.id,
            name: dbBlog.name,
            description: dbBlog.description,
            websiteUrl: dbBlog.websiteUrl,
            createdAt: dbBlog.createdAt
        }
    }
}