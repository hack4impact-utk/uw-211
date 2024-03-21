import { Translate } from 'next-translate';

export const getFormSteps = (t: Translate) => [
  {
    id: 'Step 1',
    name: t('form.preliminaries.title'),
    fields: [
      'legalName',
      'akas',
      'legalStatus',
      'agencyInfo',
      'directorName',
      'hours',
      'days',
    ],
  },
  {
    id: 'Step 2',
    name: t('form.services.title'),
    fields: ['services'],
  },
  {
    id: 'Step 3',
    name: t('form.opportunities.title'),
    fields: ['volunteerFields', 'donationFields', 'recommendationFields'],
  },
  { id: 'Step 4', name: t('form.review.title'), fields: [] },
];
