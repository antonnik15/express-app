import {Request, Response, Router} from "express";
import {db} from "../repositories/db";

export const deleteRouter = Router({})

deleteRouter.delete("/", async (req: Request, res: Response) => {
    const result = await db.dropDatabase()
    if (result) {
        res.sendStatus(204)
        return;
    }
})
