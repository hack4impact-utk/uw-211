import { z } from 'zod';

export const FormDataSchema = z.object({
  legalName: z.string().min(1, 'Legal name is required'),
  akas: z.string(),
  legalStatus: z.string().min(1, 'Legal status is required'),
  agencyInfo: z.string().min(1, 'Agency Information is required'),
  directorName: z.string().min(1, 'Director name is required'),
});
