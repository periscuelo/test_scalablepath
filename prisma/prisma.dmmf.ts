import { getDMMF } from "@prisma/internals";
import { readFile } from "fs/promises";

// Define Interfaces
interface ModelField {
  relationFromFields: string[];
}

interface Relation {
  type: string;
  relationName: string;
}

// Define a types
type GetDmmf = (fileName: string, modelName?: string) => Promise<any>;
type GetRelationDmmf = (relation: Relation, dmmf: any) => {
  relatedModel: string;
  relatedModelMetaForeingKey: ModelField;
};

// Read prisma schema file
export const getDmmf: GetDmmf = async (fileName, modelName) => {
  const schema = await readFile(fileName, 'utf8');
  const dmmf = await getDMMF({ datamodel: schema });

  const modelMeta = dmmf.datamodel.models.find(model => model.name === modelName);

  if (!modelMeta) {
    throw new Error(`Model metadata for ${modelName} is not available.`);
  }

  const modelMetaPrimaryKey = modelMeta.fields.find(field => field.isId);

  if (!modelMetaPrimaryKey) {
    throw new Error(`Model metadata primary key for ${modelName} is not available.`);
  }

  return { dmmf, modelMeta, modelMetaPrimaryKey };
}

// Read relations schema
export const getRelationDmmf: GetRelationDmmf = (relation, dmmf) => {
  const relatedModel = relation.type;
  const relatedModelMeta = dmmf.datamodel.models.find((model: { name: string; }) => model.name === relatedModel);

  if (!relatedModelMeta) {
    throw new Error(`Related model metadata for ${relatedModel} is not available.`);
  }

  const relatedModelMetaForeingKey = relatedModelMeta.fields.find((field: { relationName: string; }) => field.relationName === relation.relationName);

  if (!relatedModelMetaForeingKey) {
    throw new Error(`Related foreing key for ${relatedModel} is not available.`);
  }

  return { relatedModel, relatedModelMetaForeingKey };
}
