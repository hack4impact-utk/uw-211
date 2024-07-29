import { z } from 'zod';
import { zPreliminariesGeneralFormData } from './general';
import { zPreliminariesOperationsFormData } from './operations';
import { zPreliminariesAdditionalFormData } from './additional';

export const zPreliminariesFormData = z.object({
  ...zPreliminariesGeneralFormData.shape,
  ...zPreliminariesOperationsFormData.shape,
  ...zPreliminariesAdditionalFormData.shape,
});

export type PreliminariesFormData = z.infer<typeof zPreliminariesFormData>;

export * from './general';
export * from './operations';
export * from './additional';
