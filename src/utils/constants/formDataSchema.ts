import { z } from 'zod';

export const DaySchema = z.object({
  id: z.number(),
  day: z.union([
    z.literal('Monday'),
    z.literal('Tuesday'),
    z.literal('Wednesday'),
    z.literal('Thursday'),
    z.literal('Friday'),
    z.literal('Saturday'),
    z.literal('Sunday'),
  ]),
  openTime: z.string(),
  closeTime: z.string(),
});

export const ServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required.'),
  id: z.number(),
  fullDescription: z.string().min(1, 'Service description is required.'),
  contactPersonName: z.string(),
  daysOpen: z.array(DaySchema).min(1, 'Hours of operation is required.'),
  eligibilityRequirements: z
    .string()
    .min(1, 'Eligibility requirements is required.'),
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
  feeCategory: z
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
  isSeasonal: z.boolean(),
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

const locationSchema = z.object({
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

const languageSupportSchema = z.object({
  asl: z.boolean(),
  spanish: z.boolean(),
  teleinterpreterLanguageService: z.boolean(),
  other: z
    .object({
      selected: z.boolean(),
      content: z.array(z.string()).optional(),
    })
    .refine(
      (data) => !data.selected || (data.selected && data.content?.length != 0),
      {
        message: 'Please specify other.',
      }
    ),
});

export const additionalNumbersSchema = z.object({
  id: z.number(),
  label: z.string(),
  number: z.string(),
});

export const contactInfoSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Required')
    .regex(/^[0-9]{10}$/, {
      message: 'Must be a valid phone number.',
    }),
  faxNumber: z
    .string()
    .optional()
    .refine(
      (value) => {
        const regex = /^[0-9]{10}$/;
        return !value || regex.test(value);
      },
      {
        message: 'Must be a valid phone number.',
      }
    ),
  tollFreeNumber: z
    .string()
    .min(1, 'Required')
    .regex(/^[0-9]{10}$/, {
      message: 'Must be a valid phone number.',
    }),
  TDDTTYNumber: z
    .string()
    .min(1, 'Required')
    .regex(/^[0-9]{10}$/, {
      message: 'Must be a valid phone number.',
    }),
  additionalNumbers: z.array(additionalNumbersSchema).optional(),
  email: z
    .string()
    .min(1, 'Required')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'Must be a valid email address.',
    }),
  website: z
    .string()
    .optional()
    .refine(
      (value) => {
        const regex =
          /^(https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})+(\/[^\s]*)?$/;
        return !value || regex.test(value);
      },
      {
        message: 'Must be a valid web address.',
      }
    ),
});

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

export const FormDataSchema = z.object({
  // PRELIMINARIES

  // General
  legalName: z.string().min(1, 'Required'),
  akas: z.string(),
  legalStatus: z.string().min(1, 'Required'),
  agencyInfo: z.string().min(1, 'Required'),
  directorName: z.string().min(1, 'Required'),
  contactInfo: contactInfoSchema,
  // Up until here

  hours: z.array(DaySchema).min(1, 'Hours of operation is required.'),

  // Operations
  location: locationSchema,
  fundingSources: fundingSourcesSchema,

  // Additional
  serviceArea: serviceAreaSchema,
  annualAgencyUpdate: annualAgencyUpdateSchema,
  updaterContactInfo: contactInfoSchema.optional(),

  // Accessibility
  languageSupport: languageSupportSchema,
  supportedLanguagesWithoutNotice: z.array(z.string()),
  accessibilityADA: z.coerce.boolean({ invalid_type_error: 'invalid' }),

  // SERVICES
  services: z.array(ServiceSchema),

  // OPPORTUNITIES
  volunteerFields: VolunteerFields,
  donationFields: DonationFields,
  recommendationFields: RecommendationFields,
});
