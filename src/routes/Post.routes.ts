import { Router, Request, Response } from 'express';
import PostController from '../controller/Post.controller'

const router = Router();

router.get('/posts', (req: Request, res: Response) => {
  PostController.getPosts(req, res);
});

router.get('/posts/:id/comments', (req: Request, res: Response) => {
  PostController.getComments(req, res);
});

router.delete('/posts/:id', (req: Request, res: Response) => {
  PostController.deletePost(req, res);
});

router.delete('/posts', (req: Request, res: Response) => {
  PostController.deletePosts(req, res);
});

export default router;
