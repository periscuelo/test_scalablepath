import { Request, Response } from 'express';

// Repositories
import postRepository from '../repositories/post';
import commentRepository from '../repositories/comment';

// Utils
import responses from '../utils/responses';
const { createErrorResponse } = responses;

interface ControllerObject {
  createComment: (req: Request, res: Response) => Promise<Response>;
  moveComments: (req: Request, res: Response) => Promise<Response>;
}

const controller: ControllerObject = {
  createComment: async (req, res) => {
    try {
      const postId = Number(req.params.postId);
      const { body, name, email } = req.body as { body: string, name: string, email: string };

      if (postId && body && name && email) {
        const where = { id: postId };
        const post = await postRepository.count(where);

        if (post) {
          const data = {
            body,
            name,
            email,
            postId
          };

          const response = await commentRepository.create(data);
          return res.send(response);
        } else {
          return res.status(404).send(createErrorResponse('NOT_FOUND', 'Post to insert a comment'));
        }
      } else {
        return res.status(400).send(createErrorResponse('BAD_REQUEST', 'Comment'));
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  },
  moveComments: async (req, res) => {
    try {
      const { from, to } = req.body;
      const where = { postId: from };
      const data = { postId: to };

      if (from && to) {
        const result = await commentRepository.findMany(where);

        if (result.length) {
          const response = await commentRepository.updateMany(where, data);
          return res.send(response);
        } else {
          return res.status(404).send(createErrorResponse('NOT_FOUND', 'Comments'));
        }
      } else {
        return res.status(400).send(createErrorResponse('BAD_REQUEST', 'Comments'));
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  }
}

export default controller;
