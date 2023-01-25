import {OutPutUsersType} from "../repositories/users-repositories/users-query-repository";


declare global {
    declare namespace Express {
        export interface Request {
            user?: OutPutUsersType;
        }
    }
}
