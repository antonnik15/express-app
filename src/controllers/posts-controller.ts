import {PostsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {PostsService} from "../domain/posts-service";
import {AuthMiddleware} from "../middlewares/auth-middleware";
import {Request, Response} from "express";
import {CommentsType} from "../repositories/mongoose/types";
import {inject, injectable} from "inversify";

@injectable()
export class PostsController {
    constructor(@inject('PostsQueryRepository') protected postsQueryRepository: PostsQueryRepository,
                @inject('PostsService') protected postsService: PostsService,
                @inject('AuthMiddleware') public authMiddleware: AuthMiddleware) {
    }


    async getPosts(req: Request, res: Response) {
        const query = req.query;
        res.status(200).send(await this.postsQueryRepository.findAllPosts(query, req.user.id))
    }

    async createPost(req: Request, res: Response) {
        const postId = await this.postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        res.status(201).send(await this.postsQueryRepository.findPostById(postId, req.user.id))
    }

    async getPostById(req: Request, res: Response) {
        const post = await this.postsQueryRepository.findPostById(req.params.id, req.user.id)
        if (post) {
            res.status(200).send(post)
            return;
        }
        res.sendStatus(404)
    }

    async updatePostById(req: Request, res: Response) {
        const resultOfChange = await this.postsService.updatePostById(req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        if (resultOfChange) {
            res.sendStatus(204)
            return;
        }
        res.sendStatus(404)
    }

    async deletePostById(req: Request, res: Response) {
        const deletionResult = await this.postsService.deletePostById(req.params.id)
        if (deletionResult) {
            res.sendStatus(204)
            return;
        }
        res.sendStatus(404)
    }

    async createCommentForCertainPost(req: Request, res: Response) {
        const post = await this.postsQueryRepository.findPostById(req.params.postId, req.user.id);
        if (post) {
            const newComment: CommentsType = await this.postsService.createNewCommentForPost(
                req.params.postId,
                req.body.content,
                req.user!);
            res.status(201).send(newComment);
            return;
        }
        res.sendStatus(404)
    }

    async getCommentForCertainPost(req: Request, res: Response) {
        const post = await this.postsQueryRepository.findPostById(req.params.postId, req.user.id);
        if (post) {
            const query = req.query;
            const user = req.user;
            res.status(200).send(await this.postsQueryRepository.findCommentsForCertainPost(req.params.postId, query, user?.id))
            return;
        }
        res.sendStatus(404);
    }
    async likeOrDislikePost(req: Request, res: Response) {
        const post =  await this.postsQueryRepository.findPostById(req.params.postId, req.user.id);
        if (!post) {
            res.sendStatus(404);
            return;
        }
        await this.postsService.addLikeOrDislikeForPost(req.params.postId, req.body.likeStatus, req.user.id, req.user.login)
        res.sendStatus(204)
    }

}