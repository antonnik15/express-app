import {Router} from "express";
import {BasicAuthorization} from "../middlewares/basic-authorization";
import {
    inputUsersValidationResult,
    ValidationOfUsersInputParameters
} from "../middlewares/input-users-validation-middlewares";
import {userController} from "../application/composition-root";

export const usersRouter = Router({})

usersRouter.get("/",
    BasicAuthorization,
    userController.getUsers.bind(userController))

usersRouter.post('/',
    BasicAuthorization,
    ValidationOfUsersInputParameters,
    inputUsersValidationResult,
    userController.createUser.bind(userController))

usersRouter.delete('/:id',
    BasicAuthorization,
    userController.deleteUserById.bind(userController))