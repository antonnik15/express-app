import 'dotenv/config'
import express from "express"
import bodyParser from "body-parser"
import {runDb} from "./repositories/db";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {deleteRouter} from "./routes/delete-all-data";

const app = express();
const port = 3000 || process.env.PORT;

app.use(bodyParser());
app.use("/blogs", blogsRouter)
app.use("/posts", postsRouter)
app.use("/testing/all-data", deleteRouter)

const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`your port is ${port}`)
    })
}

startApp()
