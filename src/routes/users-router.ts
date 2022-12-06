import {Router, Response, Request} from "express";
import { usersQueryRepository} from "../repositories/users-repositories/users-query-repository";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {usersService} from "../domain/users-service";
import {
    inputUsersValidationResult,
    ValidationOfUsersInputParameters
} from "../middlewares/input-users-validation-middlewares";


export const usersRouter = Router({})

usersRouter.get("/",
    BasicAuthorization,
    async (req: Request, res: Response) => {
        const query = req.query;
        res.status(200).send(await usersQueryRepository.findAllUsers(query))
    })

usersRouter.post('/',
    BasicAuthorization,
    ValidationOfUsersInputParameters,
    inputUsersValidationResult,
    async (req: Request, res: Response) => {
        const createdUserId = await usersService.createNewUser(
            req.body.login,
            req.body.password,
            req.body.email)
        res.status(201).send(await usersQueryRepository.findUserById(createdUserId))
    })

usersRouter.delete('/:id',
    BasicAuthorization,
    async (req: Request, res: Response) => {
        const deletionResult = await usersService.deleteUserById(req.params.id);
        if (deletionResult) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404);
    })

