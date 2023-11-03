export const errors = {
  prefixes: {
    badBody: 'Bad Request Body:\n',
    invalidProperties: 'Invalid Properties:',
    missingRequiredProperties: 'Missing Required Properties:',
    typeMismatches: 'Type Mismatches:',
  },
  invalidObjectIdFormat: 'Invalid ObjectId Format',
  invalidReqMethod: 'Method Not Allowed',
  notFound: 'Entity does not exist',
  unauthorized: 'Unauthorized',
  duplicate: 'Name must be unique',
  validationFailed: 'Document validation failed | FIELD(s): ',
  badRequest: 'Bad Request',
  serverError: 'Internal Server Error',
  castError: 'Failed to cast value to appropriate type',
  objectExpected: 'Nested schema path expected Object',
  strictMode: 'Field not in schema and strict mode enabled | FIELD: ',
};
