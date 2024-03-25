import { Agency } from '@/utils/types';

export interface GetAgenciesOptions {
  populateServices: boolean;
  searchString?: string;
  compareFn?: (a: Agency, b: Agency) => number;
}

class JSendResponseOptions {
  public status?: string;
  public data?: Record<string, unknown>;
  public message?: string;
  public code?: number;
}

export class JSendResponse {
  constructor(options: JSendResponseOptions) {
    Object.assign(this, options);
  }
}
