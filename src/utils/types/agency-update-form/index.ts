import { z } from 'zod';
import { zAccessibilityFormData } from './accessibility';
import { zOpportunitiesFormData } from './opportunities';
import { zPreliminariesFormData } from './preliminaries';
import { zServicesFormData } from './services';

export const zAgencyUpdateFormData = z.object({
  ...zPreliminariesFormData.shape,
  ...zAccessibilityFormData.shape,
  ...zServicesFormData.shape,
  ...zOpportunitiesFormData.shape,
});

export type AgencyUpdateFormData = z.infer<typeof zAgencyUpdateFormData>;

export * from './preliminaries';
export * from './accessibility';
export * from './services';
export * from './opportunities';
