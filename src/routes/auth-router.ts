import {Response, Request, Router} from "express";
import {usersService} from "../domain/users-service";
import {
    inputUsersValidationResult, ValidationOfUsersInputParameters
} from "../middlewares/input-users-validation-middlewares";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {authService} from "../domain/auth-service";
import {usersQueryRepository} from "../repositories/users-repositories/users-query-repository";
import {emailAdapter} from "../adapter/email-adapter";

export const authRouter = Router({})

authRouter.post("/registration",
    ValidationOfUsersInputParameters,
    inputUsersValidationResult,
    async (req: Request, res: Response) => {
        const userId = await authService.createNewUser(req.body.login, req.body.password, req.body.email);
        if (userId) {
            res.sendStatus(204);
            return;
        }
    })

authRouter.post("/registration-confirmation", async (req: Request, res: Response) => {
    const confirmationResult = await authService.confirmEmail(req.body.code);
    if (confirmationResult) {
        res.sendStatus(204)
        return;
    }
    res.sendStatus(400)
})

authRouter.post("/registration-email-resending", async (req: Request, res: Response) => {
    const user = await usersQueryRepository.findUserByLoginOrEmail(req.body.email)
    if (user) {
        await emailAdapter.sendEmailConfirmationMessage(user);
        res.sendStatus(204)
        return;
    }
    res.sendStatus(400);
})

authRouter.post("/login",
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
    res.status(200).send({
        email: req.user!.email,
        login: req.user!.login,
        userId: req.user!.id
    })
})