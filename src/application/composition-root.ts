import {BlogsQueryRepository} from "../repositories/blogs-repositories/blogs-query-repository";
import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {PostsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {BlogsRepository} from "../repositories/blogs-repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repositories/posts-repository";
import {AuthMiddleware} from "../middlewares/auth-middleware";
import {JwtService} from "./jwt-service";
import {UsersQueryRepository} from "../repositories/users-repositories/users-query-repository";
import {CommentsQueryRepository} from "../repositories/comments-repositories/comments-query-repository";
import {CommentsService} from "../domain/comments-service";
import {AuthService} from "../domain/auth-service";
import {UsersService} from "../domain/users-service";
import {UsersRepository} from "../repositories/users-repositories/users-repository";
import {EmailAdapter} from "../adapter/email-adapter";
import {
    SecurityDevicesQueryRepository
} from "../repositories/security-devices-repositories/security-devices-query-repository";
import {SecurityDevicesRepository} from "../repositories/security-devices-repositories/security-devices-repository";
import {PostsController} from "../controllers/posts-controller";
import {CommentsController} from "../controllers/comments-controller";
import {AuthController} from "../controllers/auth-controller";
import {BlogsController} from "../controllers/blogs-controller";
import {SecurityDevicesController} from "../controllers/security-devices-controller";
import {UserController} from "../controllers/user-controller";
import {CommentsRepository} from "../repositories/comments-repositories/comments-repository";

const blogsQueryRepository = new BlogsQueryRepository();
const blogsRepository = new BlogsRepository();
const blogsService = new BlogsService(blogsRepository);
const postsRepository = new PostsRepository();
const postsService = new PostsService(postsRepository);
const postsQueryRepository = new PostsQueryRepository();
const userRepository = new UsersRepository()
const usersQueryRepository = new UsersQueryRepository();
const userService = new UsersService()

const jwtService = new JwtService();
export const authMiddleware = new AuthMiddleware(usersQueryRepository, jwtService)

const commentsQueryRepository = new CommentsQueryRepository();
const commentsRepository = new CommentsRepository();
const commentsService = new CommentsService(commentsRepository);

const emailAdapter = new EmailAdapter();

const securityDevicesQueryRepository = new SecurityDevicesQueryRepository();
const securityDevicesRepository = new SecurityDevicesRepository();

const authService = new AuthService(
    userRepository,
    emailAdapter,
    usersQueryRepository,
    jwtService,
    securityDevicesQueryRepository,
    securityDevicesRepository);

export const blogsController = new BlogsController(
    blogsQueryRepository,
    blogsService,
    postsService,
    postsQueryRepository)

export const postsController = new PostsController(
    postsQueryRepository,
    postsService,
    authMiddleware);

export const commentsController = new CommentsController(
    commentsQueryRepository,
    commentsService,
    authMiddleware);

export const authController = new AuthController(
    authService,
    userService,
    jwtService,
    authMiddleware)

export const securityDevicesController = new SecurityDevicesController(
    jwtService,
    securityDevicesQueryRepository,
    securityDevicesRepository)

export const userController = new UserController(
    usersQueryRepository,
    userService)
