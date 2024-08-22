import { Router, Request, Response } from "express";
import expeditiousCache from "express-expeditious";
import PostController from '../controller/Post.controller';

const cache = expeditiousCache({
  namespace: 'expresscache',
  defaultTtl: '5 minutes'
});

const router = Router();

router.get('/posts', cache.withTtlForStatus('1 minute', 404), (req: Request, res: Response) => {
  PostController.getPosts(req, res);
});

router.get('/posts/:id/comments', cache.withTtlForStatus('1 minute', 404), (req: Request, res: Response) => {
  PostController.getComments(req, res);
});

router.delete('/posts/:id', (req: Request, res: Response) => {
  PostController.deletePost(req, res);
});

router.delete('/posts', (req: Request, res: Response) => {
  PostController.deletePosts(req, res);
});

export default router;
