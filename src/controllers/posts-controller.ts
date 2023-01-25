import {PostsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {PostsService} from "../domain/posts-service";
import {AuthMiddleware} from "../middlewares/auth-middleware";
import {Request, Response} from "express";
import {CommentsType} from "../repositories/mongoose/types";

export class PostsController {
    constructor(protected postsQueryRepository: PostsQueryRepository,
                protected postsService: PostsService,
                public authMiddleware: AuthMiddleware) {
    }


    async getPosts(req: Request, res: Response) {
        const query = req.query;
        res.status(200).send(await this.postsQueryRepository.findAllPosts(query))
    }

    async createPost(req: Request, res: Response) {
        const postId = await this.postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        res.status(201).send(await this.postsQueryRepository.findPostById(postId))
    }

    async getPostById(req: Request, res: Response) {
        const post = await this.postsQueryRepository.findPostById(req.params.id)
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
        const post = await this.postsQueryRepository.findPostById(req.params.postId);
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
        const post = await this.postsQueryRepository.findPostById(req.params.postId);
        if (post) {
            const query = req.query;
            res.status(200).send(await this.postsQueryRepository.findCommentsForCertainPost(req.params.postId, query))
            return;
        }
        res.sendStatus(404);
    }
}