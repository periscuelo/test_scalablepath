import { Prisma, PrismaPromise } from "@prisma/client";
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
  findMany: (page?: number, limit?: number, queryConditions?: QueryConditions) => PrismaPromise<Comment[]>;
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
  findMany: (page, limit, queryConditions) => {
    const where = queryConditions ? { where: queryConditions } : {}
    const LIMIT = Number(limit) || 0
    const OFFSET = (Number(page) - 1) * LIMIT

    const query: Prisma.CommentFindManyArgs = {
      ...where,
      take: LIMIT > 0 ? LIMIT : undefined,
      skip: OFFSET > 0 ? OFFSET : undefined
    }

    return prisma.comment.findMany(query)
  }
}

export default comment
