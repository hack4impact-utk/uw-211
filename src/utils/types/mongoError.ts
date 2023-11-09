interface ValidationError {
  path: string;
  kind: string;
}

export interface MongoError extends Error {
  path: string;
  errors: Record<string, ValidationError>;
}
