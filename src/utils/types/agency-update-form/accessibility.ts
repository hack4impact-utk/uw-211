import { z } from 'zod';

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

export const zAccessibilityFormData = z.object({
  languageSupport: languageSupportSchema,
  supportedLanguagesWithoutNotice: z.array(z.string()),
  accessibilityADA: z.coerce.boolean({ invalid_type_error: 'invalid' }),
});

export type AccessibilityFormData = z.infer<typeof zAccessibilityFormData>;
