import {BlogsModel} from "../mongoose/mongoose-schemes";
import {BlogType} from "../mongoose/types";

export class BlogsRepository {
    async createNewBlogs(blog: BlogType) {
        await BlogsModel.create(blog)
        return;
    }
    async updateBlogById(id: string, name: string,
                         description: string,
                         websiteUrl: string): Promise<number> {

        const resultOfChange = await BlogsModel.updateOne({id: id},
            {
                $set: {
                    name: name,
                    websiteUrl: websiteUrl,
                    description: description
                }
            })

        return resultOfChange.modifiedCount;
    }
    async deleteBlogsById(id: string): Promise<number> {
        const deletionResult = await BlogsModel.deleteOne({id: id});
        return deletionResult.deletedCount;
    }
}