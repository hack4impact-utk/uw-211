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
    ],
  },
  {
    id: 'Step 2',
    name: 'Accessibility',
    subpages: [
      {
        id: 'Step 2.1',
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
    id: 'Step 3',
    name: 'Services',
    subpages: [
      {
        id: 'Step 3.1',
        name: 'Services',
        fields: ['services'],
      },
    ],
  },
  {
    id: 'Step 4',
    name: 'Opportunities',
    subpages: [
      {
        id: 'Step 4.1',
        name: 'Opportunities',
        fields: ['volunteerFields', 'donationFields', 'recommendationFields'],
      },
    ],
  },
  {
    id: 'Step 5',
    name: 'Review',
    subpages: [
      {
        id: 'Step 5.1',
        name: 'Review',
        fields: [],
      },
    ],
  },
];
