import "reflect-metadata"
import {UsersQueryRepository} from "../repositories/users-repository/users-query-repository";
import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";


@injectable()
export class UserController {
    constructor(@inject('UsersQueryRepository') public usersQueryRepository: UsersQueryRepository,
                @inject('UsersService') public usersService: UsersService) {
    }

    async getUsers(req: Request, res: Response) {
        const query = req.query;
        res.status(200).send(await this.usersQueryRepository.findAllUsers(query))
    }

    async createUser(req: Request, res: Response) {
        const createdUserId = await this.usersService.createNewUser(
            req.body.login,
            req.body.password,
            req.body.email)
        res.status(201).send(await this.usersQueryRepository.findUserById(createdUserId))
    }

    async deleteUserById(req: Request, res: Response) {
        const deletionResult = await this.usersService.deleteUserById(req.params.id);
        if (deletionResult) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404);
    }
}