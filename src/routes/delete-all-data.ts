import {Request, Response, Router} from "express";
import mongoose from "mongoose";


export const deleteRouter = Router({})

deleteRouter.delete("/", async (req: Request, res: Response) => {
    const result = await mongoose.connection.db.dropDatabase()
    if (result) {
        res.sendStatus(204)
        return;
    }
})
