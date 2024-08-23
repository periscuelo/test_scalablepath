import { Router, Request, Response } from "express";
import expeditiousCache from "express-expeditious";
import PostController from '../controller/Post.controller';

const cache = expeditiousCache({
  namespace: 'expresscache',
  defaultTtl: '5 minutes'
});

const router = Router();

router.get('/posts', cache.withTtlForStatus('1 minute', 404), (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'number'
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'number'
    }
  */
  PostController.getPosts(req, res);
});

router.get('/posts/:id/comments', cache.withTtlForStatus('1 minute', 404), (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.parameters['id'] = {
      in: 'path',
      required: 'true',
      type: 'number',
      description: 'Post Id to load comments'
    }
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'number'
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'number'
    }
  */
  PostController.getComments(req, res);
});

router.delete('/posts', (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.auto = false
    #swagger.parameters['body'] = {
      in: 'body',
      required: 'true',
      description: 'Post Ids to delete, comments will be cascading!',
      schema: {
        ids: [2, 3]
      }
    }
  */
  PostController.deletePosts(req, res);
});

router.delete('/posts/:id', (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.auto = false
    #swagger.parameters['id'] = {
      in: 'path',
      required: 'true',
      type: 'number',
      description: 'Post Id to delete, comments will be cascading!'
    }
  */
  PostController.deletePost(req, res);
});

export default router;
