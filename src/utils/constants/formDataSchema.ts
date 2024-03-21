import { Translate } from 'next-translate';
import { z } from 'zod';

export const getServiceSchema = (t: Translate) =>
  z.object({
    name: z.string().min(1, t('errors.required')),
    id: z.number(),
    description: z.string().min(1, t('errors.required')),
    contact: z.string(),
    // hours
    eligibility: z.string().min(1, t('errors.required')),
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
            message: t('errors.required'),
          }),
        referral: z
          .object({
            required: z.boolean(),
            content: z.string().optional(),
          })
          .refine((data) => !data.required || (data.required && data.content), {
            message: t('errors.required'),
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
        t('errors.required')
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
            message: t('errors.required'),
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
        t('errors.required')
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
            message: t('errors.required'),
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
        t('errors.required')
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

const getAgencyHours = (t: Translate) =>
  z
    .object({
      open: z
        .string()
        .min(1, t('errors.required'))
        .regex(/^[0-2]{0,1}[0-9]{1}:[0-9]{2}$/, {
          message: 'Must be a valid time. (HH:MM)',
        }),
      close: z
        .string()
        .min(1, t('errors.required'))
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

const getVolunteerFields = (t: Translate) =>
  z
    .object({
      volunteers: z.string({ invalid_type_error: t('errors.required') }),
      vol_reqs: z.string().optional(),
      vol_coor: z.string().optional(),
      vol_coor_tel: z.string().optional(),
    })
    .superRefine(({ volunteers, vol_reqs, vol_coor, vol_coor_tel }, ctx) => {
      if (volunteers === 'true') {
        if (vol_reqs === '' || vol_reqs === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.required'),
            path: ['vol_reqs'],
          });
        }

        if (vol_coor === '' || vol_coor === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.required'),
            path: ['vol_coor'],
          });
        }

        if (vol_coor_tel === '' || vol_coor_tel === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.required'),
            path: ['vol_coor_tel'],
          });
        } else if (!/^[0-9]{10}$/.test(vol_coor_tel)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.phone'),
            path: ['vol_coor_tel'],
          });
        }
      } else {
        return false;
      }
    });

const getDonationFields = (t: Translate) =>
  z
    .object({
      donation: z.string({ invalid_type_error: t('errors.required') }),
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
            message: t('errors.required'),
            path: ['don_ex'],
          });
        }

        if (don_coor === '' || don_coor === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.required'),
            path: ['don_coor'],
          });
        }

        if (don_coor_tel === '' || don_coor_tel === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.required'),
            path: ['don_coor_tel'],
          });
        } else if (!/^[0-9]{10}$/.test(don_coor_tel)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.phone'),
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
            message: t('errors.required'),
            path: ['pickup_loc'],
          });
        }
      }
    });

const getRecommendationFields = (t: Translate) =>
  z
    .object({
      recommendation: z.string({
        invalid_type_error: t('errors.required'),
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
            message: t('errors.required'),
            path: ['recommendations_contact'],
          });
        }
      }
    });

export const getFormDataSchema = (t: Translate) =>
  z.object({
    // PRELIMINARIES
    legalName: z.string().min(1, t('errors.required')),
    akas: z.string(),
    legalStatus: z.string().min(1, t('errors.required')),
    agencyInfo: z.string().min(1, t('errors.required')),
    directorName: z.string().min(1, t('errors.required')),

    hours: getAgencyHours(t),

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
        t('errors.required')
      ),

    // SERVICES
    services: z.array(getServiceSchema(t)),

    // OPPORTUNITIES
    volunteerFields: getVolunteerFields(t),
    donationFields: getDonationFields(t),
    recommendationFields: getRecommendationFields(t),
  });
