import { z } from 'zod';

export const FormDataSchema = z
  .object({
    // preliminaries
    legalName: z.string().min(1, 'Required'),
    akas: z.string(),
    legalStatus: z.string().min(1, 'Required'),
    agencyInfo: z.string().min(1, 'Required'),
    directorName: z.string().min(1, 'Required'),
    open: z.string().min(1, 'Required'),
    close: z.string().min(1, 'Required'),
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
        'Please select at least one operational business day'
      ),

    // OPPORTUNITIES
    volunteers: z.string({ invalid_type_error: 'Required' }),
    vol_reqs: z.string().optional(),
    vol_coor: z.string().optional(),
    vol_coor_tel: z
      .string()
      .regex(/^[0-9]{10}$/, {
        message: 'Must be a valid phone number.',
      })
      .optional(),

    // DONATIONS
    donation: z.string({ invalid_type_error: 'Required' }),
    don_ex: z.string().optional(),
    // pickup
    pickup: z.string().optional(),
    pickup_loc: z.string().optional(),
    don_coor: z.string().optional(),
    don_coor_tel: z
      .string()
      .regex(/^[0-9]{10}$/, {
        message: 'Must be a valid phone number.',
      })
      .optional(),

    // RECOMMENDATION
    recommendation: z.string({
      invalid_type_error: 'Required',
    }),
    recommendations_contact: z.string().optional(),
  })
  .superRefine(({ volunteers, vol_reqs, vol_coor, vol_coor_tel }, ctx) => {
    if (volunteers === 'true') {
      if (vol_reqs === '' || vol_reqs === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['vol_reqs'],
        });
      }

      if (vol_coor === '' || vol_coor === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['vol_coor'],
        });
      }

      if (vol_coor_tel === '' || vol_coor_tel === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['vol_coor_tel'],
        });
      }
    } else {
      return false;
    }
  })
  .superRefine(({ donation, don_ex, don_coor, pickup, don_coor_tel }, ctx) => {
    if (donation === 'true') {
      if (don_ex === '' || don_ex === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['don_ex'],
        });
      }

      if (pickup === '' || pickup === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['pickup'],
        });
      }

      if (don_coor === '' || don_coor === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['don_coor'],
        });
      }

      if (don_coor_tel === '' || don_coor_tel === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['don_coor_tel'],
        });
      }
    } else {
      return false;
    }
  })
  .superRefine(({ pickup, pickup_loc }, ctx) => {
    if (pickup === 'true') {
      if (pickup_loc === '' || pickup_loc === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['pickup_loc'],
        });
      }
    }
  })
  .superRefine(({ recommendation, recommendations_contact }, ctx) => {
    if (recommendation === 'true') {
      if (
        recommendations_contact === '' ||
        recommendations_contact === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['recommendations_contact'],
        });
      }
    }
  });
