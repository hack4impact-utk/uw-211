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
