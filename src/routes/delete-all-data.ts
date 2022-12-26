import {Request, Response, Router} from "express";
import mongoose from "mongoose";


export const deleteRouter = Router({})

deleteRouter.delete("/", async (req: Request, res: Response) => {
    await mongoose.connection.db.dropDatabase()
    res.sendStatus(204)
})
