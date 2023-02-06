import "reflect-metadata"
import 'dotenv/config'
import express from "express"
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser'
import {runDb} from "./repositories/mongoose/db";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {deleteRouter} from "./routers/delete-all-data";
import {usersRouter} from "./routers/users-router";
import {authRouter} from "./routers/auth-router";
import {commentsRouter} from "./routers/comments-router";
import {securityDevicesRouter} from "./routers/security-devices-router";

const app = express();
const port = process.env.PORT || 3001;

app.set('trust proxy', true)
app.use(bodyParser());
app.use(cookieParser());
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/testing/all-data", deleteRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);
app.use("/security/devices", securityDevicesRouter);

const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`your port is ${port}`)
    })
}

startApp()
