import { contactInfoSchema } from '@/utils/constants/formDataSchema';
import { z } from 'zod';

export const zPreliminariesGeneralFormData = z.object({
  legalName: z.string().min(1, 'Required'),
  akas: z.string(),
  legalStatus: z.string().min(1, 'Required'),
  agencyInfo: z.string().min(1, 'Required'),
  directorName: z.string().min(1, 'Required'),
  contactInfo: contactInfoSchema,
});

export type PreliminariesGeneralFormData = z.infer<
  typeof zPreliminariesGeneralFormData
>;
