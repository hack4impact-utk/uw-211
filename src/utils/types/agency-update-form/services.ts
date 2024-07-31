import { DaySchema } from '@/utils/constants/formDataSchema';
import { z } from 'zod';

export const zServiceFormData = z.object({
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

export const zServicesFormData = z.object({
  services: z.array(zServiceFormData),
});

export type ServiceFormData = z.infer<typeof zServiceFormData>;
export type ServicesFormData = z.infer<typeof zServicesFormData>;
