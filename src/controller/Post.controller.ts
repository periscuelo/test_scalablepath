import { Request, Response } from 'express';

// Repositories
import postRepository from '../repositories/post'
import commentRepository from '../repositories/comment'

// Utils
import responses from '../utils/responses'
const { createSuccessResponse, createErrorResponse } = responses

interface ControllerObject {
  deletePost: (req: Request, res: Response) => Promise<Response>;
  deletePosts: (req: Request, res: Response) => Promise<Response>;
  getComments: (req: Request, res: Response) => Promise<Response>;
  getPosts: (req: Request, res: Response) => Promise<Response>;
}

const controller: ControllerObject = {
  deletePost: async (req, res) => {
    try {
      const { id } = req.params as { id?: number };
      const where = { id: Number(id) };

      if (Number(id)) {
        const data = await postRepository.delete(where);

        if (data) {
          return res.send(data)
        } else {
          return res.status(404).send(createErrorResponse('NOT_FOUND', 'Post'))
        }
      } else {
        return res.status(400).send(createErrorResponse('BAD_REQUEST', 'Posts'))
      }
    } catch (e) {
      return res.status(500).send(e)
    }
  },
  deletePosts: async (req, res) => {
    try {
      const { ids } = req.body;
      const where = {
        id: { in: ids },
      };

      if (ids && ids.length > 0) {
        const data = await postRepository.deleteMany(where);
        return res.send(data)
      } else {
        return res.status(400).send(createErrorResponse('BAD_REQUEST', 'Posts'))
      }
    } catch (e) {
      return res.status(500).send(e)
    }
  },
  getComments: async (req, res) => {
    try {
      const { page, limit } = req.query as { page?: number; limit?: number };
      const { id } = req.params as { id?: number };
      const where = { postId: id };

      const data = await commentRepository.findMany(page, limit, where);
      const total_records = await commentRepository.count(where);
      const pagination_reponse = [total_records, Number(page), Number(limit)] as const;

      if (total_records > 0 && data.length > 0) {
        const posts = createSuccessResponse(data, ...pagination_reponse)
        return res.send(posts)
      } else {
        return res.status(404).send(createErrorResponse('NOT_FOUND', 'Posts'))
      }
    } catch (e) {
      return res.status(500).send(e)
    }
  },
  getPosts: async (req, res) => {
    try {
      const { page, limit } = req.query as { page?: number; limit?: number };

      const data = await postRepository.findMany(page, limit);
      const total_records = await postRepository.count();
      const pagination_reponse = [total_records, Number(page), Number(limit)] as const;

      if (total_records > 0 && data.length > 0) {
        const posts = createSuccessResponse(data, ...pagination_reponse)
        return res.send(posts)
      } else {
        return res.status(404).send(createErrorResponse('NOT_FOUND', 'Posts'))
      }
    } catch (e) {
      return res.status(500).send(e)
    }
  }
}

export default controller
