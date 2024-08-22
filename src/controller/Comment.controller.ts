import { Request, Response } from 'express';

// Repositories
import commentRepository from '../repositories/comment'

// Utils
import responses from '../utils/responses'
const { createErrorResponse } = responses

interface ControllerObject {
  moveComments: (req: Request, res: Response) => Promise<Response>;
}

const controller: ControllerObject = {
  moveComments: async (req, res) => {
    try {
      const { from, to } = req.body;
      const where = { postId: from };
      const data = { postId: to };

      if (from && to) {
        const result = await commentRepository.findMany(where);

        if (result.length) {
          const response = await commentRepository.updateMany(where, data);
          return res.send(response)
        } else {
          return res.status(404).send(createErrorResponse('NOT_FOUND', 'Comments'))
        }
      } else {
        return res.status(400).send(createErrorResponse('BAD_REQUEST', 'Comments'))
      }
    } catch (e) {
      return res.status(500).send(e)
    }
  }
}

export default controller
