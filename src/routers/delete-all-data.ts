import {Router} from "express";
import {deleteController} from "../application/composition-root";


export const deleteRouter = Router({})

deleteRouter.delete("/", deleteController.dropDB.bind(deleteController))
