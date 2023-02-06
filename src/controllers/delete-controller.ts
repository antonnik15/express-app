import {injectable} from "inversify";
import {Request, Response} from "express";
import mongoose from "mongoose";

@injectable()
export class DeleteController {
    async dropDB(req: Request, res: Response) {
        res.sendStatus(204)
        await mongoose.connection.db.dropDatabase();
    }
}