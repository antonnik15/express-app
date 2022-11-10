import { MongoClient} from "mongodb";

export type BlogsType = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}

export type PostsType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}


const mongoUri = process.env.MONGOURI || 'sdfsdf'

const client = new MongoClient(mongoUri)
export const db = client.db("hometask3")
export const postsCollection = db.collection<PostsType>("posts");
export const blogsCollection = db.collection<BlogsType>("blogs");

export async function runDb() {
    try {
        await client.connect()
        await client.db("hometask3").command({ping: 1})
        console.log(`Connected successfully to mongo service on port ${mongoUri}`)
    } catch {
        console.log("can't connect to mongodb server")
        await client.close()
    }
}
