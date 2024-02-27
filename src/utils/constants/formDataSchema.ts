import { z } from 'zod';

export const FormDataSchema = z
  .object({
    // preliminaries
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
        'At least one operational business day required'
      ),

    // OPPORTUNITIES
    volunteers: z.string({ invalid_type_error: 'Accept volunteers required.' }),
    vol_reqs: z.string().optional(),
    vol_coor: z.string().optional(),
    vol_coor_tel: z.string().optional(),

    // DONATIONS
    donation: z.string({ invalid_type_error: 'Accept donations required.' }),
    don_ex: z.string().optional(),
    // pickup
    pickup: z.string().optional(),
    pickup_loc: z.string().optional(),
    don_coor: z.string().optional(),
    don_coor_tel: z.string().optional(),

    // RECOMMENDATION
    recommendation: z.string({
      invalid_type_error: 'Recommendation field required.',
    }),
    recommendations_contact: z.string().optional(),
  })
  .superRefine(({ volunteers, vol_reqs, vol_coor, vol_coor_tel }, ctx) => {
    if (volunteers === 'true') {
      if (vol_reqs === '' || vol_reqs === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Volunteer eligbibilty is required.',
          path: ['vol_reqs'],
        });
      }

      if (vol_coor === '' || vol_coor === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Volunteer coordinator is required.',
          path: ['vol_coor'],
        });
      }

      if (vol_coor_tel === '' || vol_coor_tel === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Volunteer coordinator telephone number is required.',
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
          message: 'Examples of donations is required.',
          path: ['don_ex'],
        });
      }

      if (pickup === '' || pickup === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pickup status is required.',
          path: ['pickup'],
        });
      }

      if (don_coor === '' || don_coor === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Donation coordinator is required.',
          path: ['don_coor'],
        });
      }

      if (don_coor_tel === '' || don_coor_tel === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Donation coordinator telephone number is required.',
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
          message: 'Pickup location is required.',
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
          message: 'Recommendation contact information is required.',
          path: ['recommendations_contact'],
        });
      }
    }
  });
