import 'dotenv/config'
import express from "express"
import bodyParser from "body-parser"
import {runDb} from "./repositories/db";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {deleteRouter} from "./routes/delete-all-data";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser());
app.use("/blogs", blogsRouter)
app.use("/posts", postsRouter)
app.use("/testing/all-data", deleteRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)

const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`your port is ${port}`)
    })
}

startApp()
