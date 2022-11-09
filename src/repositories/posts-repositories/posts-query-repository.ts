import {postsCollection, PostsType} from "../db";

export const postsQueryRepository = {
    async findAllPosts(): Promise<PostsType[]> {
        return await postsCollection.find({}, {projection: {_id: 0}}).toArray()
    },
    async findPostById(id: string): Promise<PostsType | null> {
        return await postsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
}


