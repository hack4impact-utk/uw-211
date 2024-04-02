export const formSteps = [
  {
    id: 'Step 1',
    name: 'Preliminaries',
    subpages: [
      {
        id: 'Step 1.1',
        name: 'General',
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
        id: 'Step 1.2',
        name: 'Accessibility',
        fields: ['accessibilityADA'],
      },
    ],
  },
  {
    id: 'Step 2',
    name: 'Services',
    subpages: [
      {
        id: 'Step 2.1',
        name: 'Services',
        fields: ['services'],
      },
    ],
  },
  {
    id: 'Step 3',
    name: 'Opportunities',
    subpages: [
      {
        id: 'Step 3.1',
        name: 'Opportunities',
        fields: ['volunteerFields', 'donationFields', 'recommendationFields'],
      },
    ],
  },
  { id: 'Step 4', name: 'Review', subpages: [] },
];
