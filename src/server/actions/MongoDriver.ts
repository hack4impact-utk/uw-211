import dbConnect from '@/utils/db-connect';
import { Document, PipelineStage, Model, HydratedDocument } from 'mongoose';

export async function getEntities<Schema extends Document>(
  dbSchema: Model<Schema>,
  aggregate?: PipelineStage[]
): Promise<HydratedDocument<Schema>[]> {
  await dbConnect();
  let response;

  if (!!aggregate) {
    response = await dbSchema.aggregate(aggregate);
  } else {
    response = await dbSchema.find({});
  }

  return response;
}
