import mongoose from "mongoose";

const mongoUri = process.env.MONGOURI;
const dbName = 'mongoose'

mongoose.set("strictQuery", false)

export async function runDb() {
    try {
        await mongoose.connect(mongoUri! + dbName + "?retryWrites=true&w=majority");
        console.log(`Connected successfully to mongo service on port ${mongoUri}` + dbName + "?retryWrites=true&w=majority");
    } catch {
        await mongoose.disconnect();
        console.log("can't connect to mongodb server");
    }
}

// // const client = new MongoClient(mongoUri!)
// // export const db = client.db("hometask3")
// export const postsCollection = db.collection<PostsType>("posts");
// export const blogsCollection = db.collection<BlogsType>("blogs");
// export const usersCollection = db.collection<UserAccountDBType>("users");
// export const commentsCollection = db.collection<CommentsType>("comments");
// export const authSessionsCollection = db.collection<AuthSessionsType>("auth_sessions");
// export const attemptsCollection = db.collection<attemptType>("attempts")
//
// export async function runDb() {
//     try {
//         await client.connect()
//         await client.db("hometask3").command({ping: 1})
//         console.log(`Connected successfully to mongo service on port ${mongoUri}`)
//     } catch {
//         console.log("can't connect to mongodb server")
//         await client.close()
//     }
// }
