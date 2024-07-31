import { DaySchema } from '@/utils/constants/formDataSchema';
import { z } from 'zod';

export const locationSchema = z.object({
  confidential: z.coerce.boolean(),
  physicalAddress: z.string().min(1, 'Required'),
  mailingAddress: z.string(),
  county: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zipCode: z
    .string()
    .min(1, 'Required')
    .regex(/^[0-9]{5}$/, {
      message: 'Must be a valid zip code.',
    }),
});

const fundingSourcesSchema = z
  .object({
    federal: z.boolean(),
    state: z.boolean(),
    county: z.boolean(),
    city: z.boolean(),
    donations: z.boolean(),
    foundations: z.boolean(),
    feesDues: z.boolean(),
    unitedWay: z.boolean(),
    other: z
      .object({
        selected: z.boolean(),
        content: z.string().optional(),
      })
      .refine((data) => !data.selected || (data.selected && data.content), {
        message: 'Please specify other.',
      }),
  })
  .partial()
  .refine(
    (data) =>
      data.federal ||
      data.state ||
      data.county ||
      data.city ||
      data.donations ||
      data.foundations ||
      data.feesDues ||
      data.unitedWay ||
      (data.other?.selected ?? false),
    'A funding source selection is required.'
  );

export const zPreliminariesOperationsFormData = z.object({
  hours: z.array(DaySchema).min(1, 'Hours of operation is required.'),
  location: locationSchema,
  fundingSources: fundingSourcesSchema,
});

export type PreliminariesOperationsFormData = z.infer<
  typeof zPreliminariesOperationsFormData
>;
