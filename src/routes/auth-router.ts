import {Response, Request, Router} from "express";
import {usersService} from "../domain/users-service";
import {
    inputUsersValidationMiddlewaresForCheckCredentials,
    inputUsersValidationResult
} from "../middlewares/input-users-validation-middlewares";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/auth-middleware";

export const authRouter = Router({})

authRouter.post("/login",
    inputUsersValidationMiddlewaresForCheckCredentials,
    inputUsersValidationResult,
    async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (user) {
        const token = await jwtService.createJWT(user)
        res.status(200).send({accessToken: token})
        return;
    }
    res.sendStatus(401)
})

authRouter.get("/me",
    authMiddleware,
    async (req: Request, res: Response) => {
    res.sendStatus(200).send({
        email: req.user!.email,
        login: req.user!.login,
        userId: req.user!.id
    })
})