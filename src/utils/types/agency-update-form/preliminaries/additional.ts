import { contactInfoSchema } from '@/utils/constants/formDataSchema';
import { z } from 'zod';

const serviceAreaSchema = z
  .object({
    townCity: z.string(),
    zipCodes: z.array(z.string()),
    counties: z.array(z.string()),
    statewide: z.boolean().optional(),
    nationwide: z.boolean().optional(),
    other: z.string(),
  })
  .refine(
    (data) =>
      data.townCity ||
      data.zipCodes.length != 0 ||
      data.counties.length != 0 ||
      data.nationwide ||
      data.statewide ||
      data.other,
    {
      message: 'Please select at least one service area.',
    }
  );

const annualAgencyUpdateSchema = z.object({
  name: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  phoneNumber: z
    .string()
    .min(1, 'Required')
    .regex(/^[0-9]{10}$/, {
      message: 'Must be a valid phone number.',
    }),
  email: z
    .string()
    .min(1, 'Required')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'Must be a valid email address.',
    }),
  hideFromWebsite: z.coerce.boolean({ invalid_type_error: 'invalid' }),
});

export const zPreliminariesAdditionalFormData = z.object({
  serviceArea: serviceAreaSchema,
  annualAgencyUpdate: annualAgencyUpdateSchema,
  updaterContactInfo: contactInfoSchema.optional(), // Unused?
});

export type PreliminariesAdditionalFormData = z.infer<
  typeof zPreliminariesAdditionalFormData
>;
