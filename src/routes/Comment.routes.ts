import { Router, Request, Response } from "express";
import CommentController from '../controller/Comment.controller';

const router = Router();

router.patch('/comments/move', (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Comments']
    #swagger.parameters['body'] = {
      in: 'body',
      required: 'true',
      schema: {
          $from: 4,
          $to: 5
      }
    }
  */
  CommentController.moveComments(req, res);
});

router.post('/comments/add/:postId', (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Comments']
    #swagger.parameters['postId'] = {
      in: 'path',
      required: 'true',
      type: 'number',
      description: 'Post Id to add comments'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: 'true',
      schema: {
          $body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mollis dui scelerisque, facilisis nunc sit amet, dictum lectus. Proin pulvinar.",
          $name: "John Doe",
          $email: "john.doe@gmail.com"
      }
    }
  */
  CommentController.createComment(req, res);
});

export default router;
