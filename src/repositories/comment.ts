import { Prisma, PrismaPromise } from "@prisma/client";
import { GetBatchResult } from "@prisma/client/runtime/library";
import prisma from "../../prisma";

interface Comment {
  id?: number;
  body: string;
  name: string;
  email: string;
  postId: number;
}

interface CommentObject {
  count: (queryConditions?: QueryConditions) => PrismaPromise<number>;
  createMany: (data: Comment[]) => Promise<void>;
  findMany: (queryConditions?: QueryConditions, page?: number, limit?: number) => PrismaPromise<Comment[]>;
  updateMany: (queryConditions: QueryConditions, data: Partial<Comment>) => Promise<GetBatchResult>;
}

type QueryConditions = Partial<Comment>;

const comment: CommentObject = {
  count: (queryConditions) => {
    const where = queryConditions ? { where: queryConditions } : {}
    return prisma.comment.count(where)
  },
  createMany: async (data) => {
    await prisma.comment.createMany({
      data,
      skipDuplicates: true,
    })
  },
  findMany: (queryConditions, page, limit) => {
    const where = queryConditions ? { where: queryConditions } : {}
    const LIMIT = Number(limit) || 0
    const OFFSET = (Number(page) - 1) * LIMIT

    const query: Prisma.CommentFindManyArgs = {
      ...where,
      take: LIMIT > 0 ? LIMIT : undefined,
      skip: OFFSET > 0 ? OFFSET : undefined
    }

    return prisma.comment.findMany(query)
  },
  updateMany: (queryConditions, data) => {
    return prisma.comment.updateMany({
      where: queryConditions,
      data,
    })
  }
}

export default comment
