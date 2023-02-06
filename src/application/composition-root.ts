import {BlogsQueryRepository} from "../repositories/blogs-repositories/blogs-query-repository";
import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {PostsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {BlogsRepository} from "../repositories/blogs-repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repositories/posts-repository";
import {AuthMiddleware, AuthMiddlewareForComments} from "../middlewares/auth-middleware";
import {JwtService} from "./jwt-service";
import {UsersQueryRepository} from "../repositories/users-repository/users-query-repository";
import {CommentsQueryRepository} from "../repositories/comments-repositories/comments-query-repository";
import {CommentsService} from "../domain/comments-service";
import {AuthService} from "../domain/auth-service";
import {UsersService} from "../domain/users-service";
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
import {Container} from "inversify";
import {DeleteController} from "../controllers/delete-controller";
import {UsersRepository} from "../repositories/users-repository/users-repository";

// const blogsQueryRepository = new BlogsQueryRepository();
// const blogsRepository = new BlogsRepository();
// const blogsService = new BlogsService(blogsRepository);
// const postsRepository = new PostsRepository();
// const postsQueryRepository = new PostsQueryRepository();
// const postsService = new PostsService(postsRepository, postsQueryRepository);
// const userRepository = new UsersRepository()
// const usersQueryRepository = new UsersQueryRepository();
// const userService = new UsersService()
//
// const jwtService = new JwtService();
// export const authMiddleware = new AuthMiddleware(usersQueryRepository, jwtService)
//
// const commentsQueryRepository = new CommentsQueryRepository();
// const commentsRepository = new CommentsRepository();
// const commentsService = new CommentsService(commentsRepository, commentsQueryRepository);
//
// const emailAdapter = new EmailAdapter();
//
// const securityDevicesQueryRepository = new SecurityDevicesQueryRepository();
// const securityDevicesRepository = new SecurityDevicesRepository();
//
// const authService = new AuthService(
//     userRepository,
//     emailAdapter,
//     usersQueryRepository,
//     jwtService,
//     securityDevicesQueryRepository,
//     securityDevicesRepository);
//
// export const blogsController = new BlogsController(
//     blogsQueryRepository,
//     blogsService,
//     postsService,
//     postsQueryRepository)
//
// export const postsController = new PostsController(
//     postsQueryRepository,
//     postsService,
//     authMiddleware);
//
// export const commentsController = new CommentsController(
//     commentsQueryRepository,
//     commentsService,
//     authMiddleware);
//
// export const authController = new AuthController(
//     authService,
//     userService,
//     jwtService,
//     authMiddleware)
//
// export const securityDevicesController = new SecurityDevicesController(
//     jwtService,
//     securityDevicesQueryRepository,
//     securityDevicesRepository)
//
// export const userController = new UserController(
//     usersQueryRepository,
//     userService)
// export const authMiddlewareForComments = new AuthMiddlewareForComments(usersQueryRepository, jwtService)

const container = new Container();

container.bind<UserController>('UserController').to(UserController);
container.bind<UsersQueryRepository>('UsersQueryRepository').to(UsersQueryRepository);
container.bind<UsersService>('UsersService').to(UsersService);
container.bind<UsersRepository>('UsersRepository').to(UsersRepository);

export const userController = container.get<UserController>('UserController');

container.bind<SecurityDevicesController>('SecurityDevicesController').to(SecurityDevicesController);
container.bind<JwtService>('JwtService').to(JwtService);
container.bind<SecurityDevicesQueryRepository>('SecurityDevicesQueryRepository').to(SecurityDevicesQueryRepository);
container.bind<SecurityDevicesRepository>('SecurityDevicesRepository').to(SecurityDevicesRepository);

export const securityDevicesController = container.get<SecurityDevicesController>('SecurityDevicesController');

container.bind<PostsRepository>('PostsRepository').to(PostsRepository);
container.bind<PostsController>('PostsController').to(PostsController);
container.bind<PostsQueryRepository>('PostsQueryRepository').to(PostsQueryRepository);
container.bind<PostsService>('PostsService').to(PostsService);
container.bind<AuthMiddleware>('AuthMiddleware').to(AuthMiddleware);
container.bind<AuthMiddlewareForComments>('AuthMiddlewareForComments').to(AuthMiddlewareForComments);

export const postsController = container.get<PostsController>('PostsController')
export const authMiddleware = container.get<AuthMiddleware>('AuthMiddleware');
export const authMiddlewareForComments = container.get<AuthMiddlewareForComments>('AuthMiddlewareForComments')

container.bind<DeleteController>('DeleteController').to(DeleteController)

export const deleteController = container.get<DeleteController>('DeleteController')

container.bind<CommentsController>('CommentsController').to(CommentsController);
container.bind<CommentsQueryRepository>('CommentsQueryRepository').to(CommentsQueryRepository);
container.bind<CommentsService>('CommentsService').to(CommentsService);
container.bind<CommentsRepository>('CommentsRepository').to(CommentsRepository);

export const commentsController = container.get<CommentsController>('CommentsController');

container.bind<BlogsController>('BlogsController').to(BlogsController);
container.bind<BlogsQueryRepository>('BlogsQueryRepository').to(BlogsQueryRepository);
container.bind<BlogsService>('BlogsService').to(BlogsService);
container.bind<BlogsRepository>('BlogsRepository').to(BlogsRepository);

export const blogsController = container.get<BlogsController>('BlogsController');

container.bind<AuthController>('AuthController').to(AuthController);
container.bind<AuthService>('AuthService').to(AuthService);
container.bind<EmailAdapter>('EmailAdapter').to(EmailAdapter);

export const authController = container.get<AuthController>('AuthController');



