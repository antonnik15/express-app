import {BlogsQueryRepository} from "../repositories/blogs-repositories/blogs-query-repository";
import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {PostsQueryRepository} from "../repositories/posts-repositories/posts-query-repository";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController {
    constructor(@inject('BlogsQueryRepository') public blogsQueryRepository: BlogsQueryRepository,
                @inject('BlogsService') public blogsService: BlogsService,
                @inject('PostsService') public postsService: PostsService,
                @inject('PostsQueryRepository') public postsQueryRepository: PostsQueryRepository) {
    }

    async getBlogs(req: Request, res: Response) {
        const query = req.query;
        res.status(200).send(await this.blogsQueryRepository.findAllBlogs(query))
    }

    async createBlog(req: Request, res: Response) {
        const createdBlogId = await this.blogsService.createNewBlogs(
            req.body.name,
            req.body.description,
            req.body.websiteUrl)

        res.status(201).send(await this.blogsQueryRepository.findBlogById(createdBlogId))
    }

    async getBlogById(req: Request, res: Response) {
        const blog = await this.blogsQueryRepository.findBlogById(req.params.id)
        if (blog) {
            res.status(200).send(blog)
            return;
        }
        res.sendStatus(404)
    }

    async updateBlogById(req: Request, res: Response) {
        const resultOfChange = await this.blogsService.updateBlogById(req.params.id,
            req.body.name,
            req.body.description,
            req.body.websiteUrl)

        if (resultOfChange) {
            res.sendStatus(204)
            return;
        }
        res.sendStatus(404)
    }

    async deleteBlogById(req: Request, res: Response) {
        const deletionResult = await this.blogsService.deleteBlogsById(req.params.id)
        if (deletionResult) {
            res.sendStatus(204)
            return;
        }
        res.sendStatus(404)
    }

    async createPostForCertainBlog(req: Request, res: Response) {
        const blog = await this.blogsQueryRepository.findBlogById(req.params.blogId);
        if (blog) {
            const idOfCreatedPost = await this.postsService.createPost(req.body.title,
                req.body.shortDescription,
                req.body.content,
                req.params.blogId)
            res.status(201).send(await this.postsQueryRepository.findPostById(idOfCreatedPost))
            return;
        }
        res.sendStatus(404)
    }

    async getPostForCertainBlog(req: Request, res: Response) {
        const blog = await this.blogsQueryRepository.findBlogById(req.params.blogId);
        if (blog) {
            const query = req.query;
            res.status(200).send(await this.postsQueryRepository.findPostsForCertainBlog(req.params.blogId, query))
            return;
        }
        res.sendStatus(404)
    }
}