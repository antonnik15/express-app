import {Request, Response, Router} from "express";
import {client} from "../repositories/db";

export const deleteRouter = Router({})

deleteRouter.delete("/", async (req: Request, res: Response) => {
    const result = await client.db("hometask3").dropDatabase()
    if (result) {
        res.sendStatus(204)
    }
})
