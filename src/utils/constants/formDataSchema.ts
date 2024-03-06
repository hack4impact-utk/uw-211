import { z } from 'zod';

export const HoursOfOperationOfADaySchema = z.object({
  id: z.number(),
  day: z.number(),
  start: z.number(),
  end: z.number(),
});

export const HoursOfOperationDataSchema = z
  .array(HoursOfOperationOfADaySchema)
  .refine((hours) => hours.length != 0, 'Hours of operation is required.');

export const ServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required.'),
  id: z.number(),
  description: z.string().min(1, 'Service description is required.'),
  contact: z.string(),
  hours: HoursOfOperationDataSchema,
  eligibility: z.string().min(1, 'Eligibility requirements is required.'),
  applicationProcess: z
    .object({
      walkIn: z.boolean(),
      telephone: z.boolean(),
      appointment: z.boolean(),
      online: z.boolean(),
      other: z
        .object({
          selected: z.boolean(),
          content: z.string().optional(),
        })
        .refine((data) => !data.selected || (data.selected && data.content), {
          message: 'Please specify other.',
        }),
      referral: z
        .object({
          required: z.boolean(),
          content: z.string().optional(),
        })
        .refine((data) => !data.required || (data.required && data.content), {
          message: 'Please specify whom referral is required from.',
        }),
    })
    .partial()
    .refine(
      (data) =>
        data.walkIn ||
        data.telephone ||
        data.appointment ||
        data.online ||
        (data.other?.selected ?? false),
      'An application process selection is required.'
    ),
  fees: z
    .object({
      none: z.boolean(),
      straight: z
        .object({
          selected: z.boolean(),
          content: z.string().optional(),
        })
        .refine((data) => !data.selected || (data.selected && data.content), {
          message: 'Please specify straight fee.',
        }),
      slidingScale: z.boolean(),
      medicaid_tenncare: z.boolean(),
      medicare: z.boolean(),
      private: z.boolean(),
    })
    .partial()
    .refine(
      (data) =>
        data.none ||
        (data.straight?.selected ?? false) ||
        data.slidingScale ||
        data.medicaid_tenncare ||
        data.medicare ||
        data.private,
      'A fee selection is required.'
    ),
  requiredDocuments: z
    .object({
      none: z.boolean(),
      stateId: z.boolean(),
      ssn: z.boolean(),
      proofOfResidence: z.boolean(),
      proofOfIncome: z.boolean(),
      birthCertificate: z.boolean(),
      medicalRecords: z.boolean(),
      psychRecords: z.boolean(),
      proofOfNeed: z.boolean(),
      utilityBill: z.boolean(),
      utilityCutoffNotice: z.boolean(),
      proofOfCitizenship: z.boolean(),
      proofOfPublicAssistance: z.boolean(),
      driversLicense: z.boolean(),
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
        data.none ||
        data.stateId ||
        data.ssn ||
        data.proofOfResidence ||
        data.proofOfIncome ||
        data.birthCertificate ||
        data.medicalRecords ||
        data.psychRecords ||
        data.proofOfNeed ||
        data.utilityBill ||
        data.utilityCutoffNotice ||
        data.proofOfCitizenship ||
        data.proofOfPublicAssistance ||
        data.driversLicense ||
        (data.other?.selected ?? false),
      'A selection for required documents is required.'
    ),
});

const VolunteerFields = z
  .object({
    volunteers: z.string({ invalid_type_error: 'Required' }),
    vol_reqs: z.string().optional(),
    vol_coor: z.string().optional(),
    vol_coor_tel: z.string().optional(),
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
      } else if (!/^[0-9]{10}$/.test(vol_coor_tel)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be a valid phone number.',
          path: ['vol_coor_tel'],
        });
      }
    } else {
      return false;
    }
  });

const DonationFields = z
  .object({
    donation: z.string({ invalid_type_error: 'Required' }),
    don_ex: z.string().optional(),
    // pickup
    pickup: z.string().default('false'),
    pickup_loc: z.string().optional(),
    don_coor: z.string().optional(),
    don_coor_tel: z.string().optional(),
  })
  .superRefine(({ donation, don_ex, don_coor, don_coor_tel }, ctx) => {
    if (donation === 'true') {
      if (don_ex === '' || don_ex === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['don_ex'],
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
      } else if (!/^[0-9]{10}$/.test(don_coor_tel)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be a valid phone number.',
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
  });

const RecommendationFields = z
  .object({
    recommendation: z.string({
      invalid_type_error: 'Required',
    }),
    recommendations_contact: z.string().optional(),
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

export const FormDataSchema = z.object({
  // PRELIMINARIES
  legalName: z.string().min(1, 'Required'),
  akas: z.string(),
  legalStatus: z.string().min(1, 'Required'),
  agencyInfo: z.string().min(1, 'Required'),
  directorName: z.string().min(1, 'Required'),

  hours: HoursOfOperationDataSchema,

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

  // SERVICES
  services: z.array(ServiceSchema),

  // OPPORTUNITIES
  volunteerFields: VolunteerFields,
  donationFields: DonationFields,
  recommendationFields: RecommendationFields,
});
