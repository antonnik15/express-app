import {Router, Response, Request} from "express";
import { usersQueryRepository} from "../repositories/users-repositories/users-query-repository";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {usersService} from "../domain/users-service";
import {inputUsersValidationMiddlewares, inputUsersValidationResult} from "../middlewares/input-users-validation-middlewares";


export const usersRouter = Router({})

usersRouter.get("/",
    BasicAuthorization,
    async (req: Request, res: Response) => {
        const query = req.query;
        res.status(200).send(await usersQueryRepository.findAllUsers(
            query.pageNumber = '1',
            query.pageSize = '10',
            query.sortBy = 'createdAt',
            query.sortDirection = 'desc',
            query.searchLoginTerm = undefined,
            query.searchEmailTerm = undefined
        ))
    })

usersRouter.post('/',
    BasicAuthorization,
    inputUsersValidationMiddlewares,
    inputUsersValidationResult,
    async (req: Request, res: Response) => {
        const createdUserId = await usersService.createNewUser(req.body.login,
            req.body.password, req.body.email)
        res.status(201).send(await usersQueryRepository.findUserById(createdUserId))
    })

usersRouter.delete('/:id',
    BasicAuthorization,
    async (req: Request, res: Response) => {
        res.sendStatus(await usersService.deleteUserById(req.params.id))
    })


