import {Request, Response, Router} from "express";
import mongoose from "mongoose";


export const deleteRouter = Router({})

deleteRouter.delete("/",  (req: Request, res: Response) => {
    mongoose.connection.db.dropDatabase()
    res.sendStatus(204)
})
