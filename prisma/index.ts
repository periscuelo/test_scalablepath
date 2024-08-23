import { PrismaClient } from "@prisma/client";
import { softDelete, softDeleteMany, filterSoftDeleted } from './prisma.extensions';

// Initialize Prisma Client with the extensions
const prisma = new PrismaClient().$extends(softDelete).$extends(softDeleteMany).$extends(filterSoftDeleted);

export default prisma;
