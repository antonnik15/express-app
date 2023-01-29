import {Request, Response, Router} from "express";
import mongoose from "mongoose";


export const deleteRouter = Router({})

class DeleteController {
    async dropDB(req: Request, res: Response) {
        await mongoose.connection.db.dropDatabase();
        res.sendStatus(204)
    }
}

const deleteController = new DeleteController();
deleteRouter.delete("/", deleteController.dropDB.bind(deleteController))
