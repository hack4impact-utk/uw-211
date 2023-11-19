import { z } from 'zod';

export const FormDataSchema = z.object({
  legalName: z.string().min(1, 'Legal name is required'),
  akas: z.string(),
  legalStatus: z.string().min(1, 'Legal status is required'),
  agencyInfo: z.string().min(1, 'Agency Information is required'),
  directorName: z.string().min(1, 'Director name is required'),
  open: z.string().min(1, 'Opening time required'),
  close: z.string().min(1, 'Closing time required'),
  days: z
    .object({
      monday: z.boolean(),
      tuesday: z.boolean(),
      wednesday: z.boolean(),
      thursday: z.boolean(),
      friday: z.boolean(),
    })
    .partial()
    .refine(
      (data) =>
        data.monday ||
        data.tuesday ||
        data.wednesday ||
        data.thursday ||
        data.friday,
      'At least one operational buisness day required'
    ),
});
