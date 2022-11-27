import { MongoClient} from "mongodb";

export type BlogsType = {
    id: string
    name: string
    description: string
    websiteUrl: string
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


export type UserAccountDBType = {
    id: string
    accountData: {
        login: string
        email: string
        password: string
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
    },
    isConfirmed: boolean
};

export type CommentsType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId?: string
}

const mongoUri = process.env.MONGOURI

const client = new MongoClient(mongoUri!)
export const db = client.db("hometask3")
export const postsCollection = db.collection<PostsType>("posts");
export const blogsCollection = db.collection<BlogsType>("blogs");
export const usersCollection = db.collection<UserAccountDBType>("users");
export const commentsCollection = db.collection<CommentsType>("comments")

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
