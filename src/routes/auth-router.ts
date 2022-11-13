import {Response, Request, Router} from "express";
import {usersService} from "../domain/users-service";
import {
    inputUsersValidationMiddlewaresForCheckCredentials,
    inputUsersValidationResult
} from "../middlewares/input-users-validation-middlewares";

export const authRouter = Router({})

authRouter.post("/login",
    inputUsersValidationMiddlewaresForCheckCredentials,
    inputUsersValidationResult,
    async (req: Request, res: Response) => {
    const checkResult = await usersService.checkCredentials(req.body.login, req.body.password)
    res.sendStatus(checkResult)
})