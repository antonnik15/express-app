import {OutPutUsersType} from "../repositories/users-repository/users-query-repository";


declare global {
    declare namespace Express {
        export interface Request {
            user?: OutPutUsersType;
        }
    }
}
