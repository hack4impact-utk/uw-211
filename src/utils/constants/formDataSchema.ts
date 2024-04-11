import { z } from 'zod';

const daySchema = z.object({
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
  // hours
  daysOpen: z.array(daySchema),
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
});

const convertToMinutes = (hours: string, minutes: string) => {
  return parseInt(hours) * 60 + parseInt(minutes);
};

const checkValidHours = (open: string, close: string) => {
  const open_split = open.split(':');
  const open_result = convertToMinutes(open_split[0], open_split[1]);

  const close_split = close.split(':');
  const close_result = convertToMinutes(close_split[0], close_split[1]);

  if (open_result > close_result) {
    return false;
  } else {
    return true;
  }
};

const AgencyHours = z
  .object({
    open: z
      .string()
      .min(1, 'Required')
      .regex(/^[0-2]{0,1}[0-9]{1}:[0-9]{2}$/, {
        message: 'Must be a valid time. (HH:MM)',
      }),
    close: z
      .string()
      .min(1, 'Required')
      .regex(/^[0-2]{0,1}[0-9]{1}:[0-9]{2}$/, {
        message: 'Must be a valid time. (HH:MM)',
      }),
  })
  .superRefine(({ open, close }, ctx) => {
    if (!checkValidHours(open, close)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Opening time must be before closing time.',
        path: ['open'],
      });
    }
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
  zipCode: z.string().min(1, 'Required'),
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

const contactInfoSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Required')
    .regex(/^[0-9]{10}$/, {
      message: 'Must be a valid phone number.',
    }),
  faxNumber: z
    .string()
    .min(1, 'Required')
    .regex(/^[0-9]{10}$/, {
      message: 'Must be a valid phone number.',
    }),
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
  additionalNumbers: z.array(z.string()).optional(),
  email: z
    .string()
    .min(1, 'Required')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'Must be a valid email address.',
    }),
  website: z
    .string()
    .min(1, 'Required')
    .regex(
      /^(https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})+(\/[^\s]*)?$/,
      {
        message: 'Must be a valid web address.',
      }
    ),
});

const annualAgencyUpdateSchema = z.object({
  name: z.string(),
  title: z.string(),
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
  hideFromWebsite: z.boolean(),
});

export const FormDataSchema = z.object({
  // PRELIMINARIES
  legalName: z.string().min(1, 'Required'),
  akas: z.string(),
  legalStatus: z.string().min(1, 'Required'),
  agencyInfo: z.string().min(1, 'Required'),
  directorName: z.string().min(1, 'Required'),

  // the following must be required, currently not implement in the front end
  // Fields with .optional will be required in the future
  serviceArea: serviceAreaSchema,
  fundingSources: fundingSourcesSchema,
  location: locationSchema,
  contactInfo: contactInfoSchema,
  annualAgencyUpdate: annualAgencyUpdateSchema.optional(),
  teleinterpreterLanguageService: z.boolean().optional(),
  supportedLanguages: z
    .array(z.union([z.literal('ASL'), z.literal('Spanish'), z.string()]))
    .optional(),
  supportedLanguagesWithoutNotice: z.array(z.string()).optional(),
  accessibilityADA: z.boolean().optional(),
  updaterContactInfo: contactInfoSchema.optional(),
  // Up until here

  hours: AgencyHours,

  days: z
    .object({
      monday: z.boolean(),
      tuesday: z.boolean(),
      wednesday: z.boolean(),
      thursday: z.boolean(),
      friday: z.boolean(),
      saturday: z.boolean(),
      sunday: z.boolean(),
    })
    .partial()
    .refine(
      (data) =>
        data.monday ||
        data.tuesday ||
        data.wednesday ||
        data.thursday ||
        data.friday ||
        data.saturday ||
        data.sunday,
      'Please select at least one operational business day'
    ),

  // SERVICES
  services: z.array(ServiceSchema),

  // OPPORTUNITIES
  volunteerFields: VolunteerFields,
  donationFields: DonationFields,
  recommendationFields: RecommendationFields,
});
