import {postsCollection} from "../db";
import {ObjectId} from "mongodb";

export const postsQueryRepository = {
    async findAllPosts(): Promise<OutPutPostType[]> {
        const dbPosts: DbPostType[] = await postsCollection.find({}).toArray()
        return dbPosts.map((post) => {
            return this.mapDbPostToOutPutPostType(post)
        });
    },
    async findPostById(id: string): Promise<OutPutPostType | undefined> {
        const dbPostById: DbPostType | null =  await postsCollection.findOne({id: id})
        if(dbPostById) {
            return this.mapDbPostToOutPutPostType(dbPostById)
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


