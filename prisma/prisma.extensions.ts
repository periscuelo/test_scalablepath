import { Prisma, PrismaClient } from "@prisma/client";
import { getDmmf, getRelationDmmf } from './prisma.dmmf'

// Prisma schema file path
const schemaPath = process.env.DATABASE_SCHEMA || './prisma/schema.prisma';

type ModelDelegate = {
  updateMany: (args: { where: any; data: any }) => Prisma.PrismaPromise<any>;
};

// Extension for soft delete with cascading logic
export const softDelete = Prisma.defineExtension({
  name: 'softDelete',
  model: {
    $allModels: {
      async delete<M, A>(
        this: M,
        where: Prisma.Args<M, 'delete'>['where'],
      ): Promise<Prisma.Result<M, A, 'update'>> {
        const context = Prisma.getExtensionContext(this);
        const prisma = context as PrismaClient;

        const modelName = context.$name;
        const { dmmf, modelMeta, modelMetaPrimaryKey } = await getDmmf(schemaPath, modelName);

        const selectId = await (prisma as any).findUnique({
          select: { [modelMetaPrimaryKey.name]: true },
          where
        });

        if (selectId) {
          // Soft delete the parent record
          const parentResult = await (prisma as any).update({
            where,
            data: {
              deletedAt: new Date(),
            },
          });

          // Soft delete the child record
          const transactions: Prisma.PrismaPromise<any>[] = [];

          for (const relation of modelMeta.fields) {
            if (relation.relationName) {
              const { relatedModel, relatedModelMetaForeingKey } = getRelationDmmf(relation, dmmf);
              const [foreignKey] = relatedModelMetaForeingKey.relationFromFields;

              // Ensure the model delegate is properly catched
              const prismaParent = prisma['$parent' as keyof PrismaClient] as any;
              const modelDelegate = prismaParent[relatedModel] as ModelDelegate;

              transactions.push(
                modelDelegate.updateMany({
                  where: { [foreignKey]: parentResult[modelMetaPrimaryKey.name] },
                  data: { deletedAt: new Date() },
                })
              );
            }
          }

          // Use transaction with PrismaPromise
          await Promise.all(transactions);

          return parentResult;
        }

        return Promise.resolve(null) as any;
      },
    },
  },
});

//extension for soft delete Many with cascading logic
export const softDeleteMany = Prisma.defineExtension({
  name: 'softDeleteMany',
  model: {
    $allModels: {
      async deleteMany<M, A>(
        this: M,
        where: Prisma.Args<M, 'deleteMany'>['where'],
      ): Promise<Prisma.Result<M, A, 'updateMany'>> {
        const context = Prisma.getExtensionContext(this);
        const prisma = context as PrismaClient;

        const modelName = context.$name;
        const { dmmf, modelMeta, modelMetaPrimaryKey } = await getDmmf('./prisma/schema.prisma', modelName);

        const selectIds = await (prisma as any).findMany({
          select: { [modelMetaPrimaryKey.name]: true },
          where
        });

        const ids = selectIds.map((record: { [x: string]: any; }) => record[modelMetaPrimaryKey.name]);

        if (ids.length) {
          // Soft delete the parent record
          const parentResult = await (prisma as any).updateMany({
            where,
            data: {
              deletedAt: new Date(),
            },
          });

          // Soft delete the child record
          const transactions: Prisma.PrismaPromise<any>[] = [];

          for (const relation of modelMeta.fields) {
            if (relation.relationName) {
              const { relatedModel, relatedModelMetaForeingKey } = getRelationDmmf(relation, dmmf);
              const [foreignKey] = relatedModelMetaForeingKey.relationFromFields;

              // Ensure the model delegate is properly catched
              const prismaParent = prisma['$parent' as keyof PrismaClient] as any;
              const modelDelegate = prismaParent[relatedModel] as ModelDelegate;

              transactions.push(
                modelDelegate.updateMany({
                  where: { [foreignKey]: { in: ids } },
                  data: { deletedAt: new Date() },
                })
              );
            }
          }

          // Use transaction with PrismaPromise
          await Promise.all(transactions);

          return parentResult;
        }

        return { count: 0 } as any;
      },
    },
  },
});

//extension for filtering soft deleted rows from queries
export const filterSoftDeleted = Prisma.defineExtension({
  name: 'filterSoftDeleted',
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (
          operation === 'findUnique' ||
          operation === 'findFirst' ||
          operation === 'findMany'
        ) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        }
        return query(args);
      },
    },
  },
});
