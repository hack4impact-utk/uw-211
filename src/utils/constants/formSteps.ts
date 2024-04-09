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
          'contactInfo',
        ],
      },
      {
        id: 'Step 1.2',
        name: 'Operations',
        fields: ['hours', 'days', 'location', 'fundingSources'],
      },
      {
        id: 'Step 1.3',
        name: 'Additional',
        fields: ['service area', 'Information Update Contact Info'],
      },
      {
        id: 'Step 1.4',
        name: 'Accessibility',
        fields: [
          'Teleinterpreter Language Service',
          'Supported Languages',
          'Supported Languages Without Notice',
          'Accessibility ADA',
        ],
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
