export const formSteps = [
  {
    id: 'Step 1',
    name: 'Preliminaries',
    fields: [
      'legalName',
      'akas',
      'legalStatus',
      'agencyInfo',
      'directorName',
      'hours',
    ],
  },
  {
    id: 'Step 2',
    name: 'Services',
    fields: ['services'],
  },
  {
    id: 'Step 3',
    name: 'Opportunities',
    fields: ['volunteerFields', 'donationFields', 'recommendationFields'],
  },
  { id: 'Step 4', name: 'Review', fields: [] },
];
