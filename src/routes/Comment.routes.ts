import { Router, Request, Response } from "express";
import CommentController from '../controller/Comment.controller';

const router = Router();

router.patch('/comments/move', (req: Request, res: Response) => {
  CommentController.moveComments(req, res);
});

router.post('/comments/add/:postId', (req: Request, res: Response) => {
  CommentController.createComment(req, res);
});

export default router;
