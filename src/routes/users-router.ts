import {Router, Response, Request} from "express";
import { usersQueryRepository} from "../repositories/users-repositories/users-query-repository";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {usersService} from "../domain/users-service";
import {inputUsersValidationMiddlewares, inputUsersValidationResult} from "../middlewares/input-users-validation-middlewares";
import {SortDirection} from "mongodb";



export const usersRouter = Router({})

usersRouter.get("/",
    BasicAuthorization,
    async (req: Request, res: Response) => {
        const query = req.query;
        res.status(200).send(await usersQueryRepository.findAllUsers(
            query.pageNumber as string | undefined,
            query.pageSize as string | undefined,
            query.sortBy as string | undefined,
            query.sortDirection as SortDirection | undefined,
            query.searchLoginTerm as undefined | string,
            query.searchEmailTerm as undefined | string
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

