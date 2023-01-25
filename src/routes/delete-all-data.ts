import {Request, Response, Router} from "express";
import mongoose from "mongoose";


export const deleteRouter = Router({})

class DeleteController {
    dropDB(req: Request, res: Response) {
        mongoose.connection.db.dropDatabase()
        res.sendStatus(204)
    }
}

const deleteController = new DeleteController();
deleteRouter.delete("/", deleteController.dropDB.bind(deleteController))
