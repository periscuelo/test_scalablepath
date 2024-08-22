import { Prisma, PrismaPromise } from "@prisma/client";
import { GetBatchResult } from "@prisma/client/runtime/library";
import prisma from "../../prisma";

interface WhereClause {
  id: {
    in: number[];
  };
}

interface Post {
  id?: number;
  body: string;
  image: string;
  title: string;
  userId: number;
}

interface PostReturn extends Post {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface PostObject {
  count: (queryConditions?: QueryConditions) => PrismaPromise<number>;
  delete: (queryConditions: QueryConditions) => Promise<PostReturn>;
  deleteMany: (queryConditions: QueryConditions) => Promise<GetBatchResult>;
  createMany: (data: Post[]) => Promise<void>;
  findMany: (queryConditions?: QueryConditions, page?: number, limit?: number) => PrismaPromise<Post[]>;
}

type QueryConditions = Partial<Post> | WhereClause;

const post: PostObject = {
  count: (queryConditions) => {
    const where = queryConditions ? { where: queryConditions } : {};
    return prisma.post.count(where);
  },
  createMany: async (data) => {
    await prisma.post.createMany({
      data,
      skipDuplicates: true,
    });
  },
  delete: (queryConditions) => {
    return prisma.post.delete(queryConditions as Prisma.PostWhereUniqueInput);
  },
  deleteMany: (queryConditions) => {
    return prisma.post.deleteMany(queryConditions as Prisma.PostWhereUniqueInput);
  },
  findMany: (queryConditions, page, limit) => {
    const where = queryConditions ? { where: queryConditions } : {};
    const LIMIT = Number(limit) || 0;
    const OFFSET = (Number(page) - 1) * LIMIT;

    const query: Prisma.PostFindManyArgs = {
      ...where,
      take: LIMIT > 0 ? LIMIT : undefined,
      skip: OFFSET > 0 ? OFFSET : undefined
    }

    return prisma.post.findMany(query);
  }
}

export default post;
