export class ApiError extends Error {
  status: number;
  errors: unknown[];

  constructor(status: number, message: string, errors: unknown[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function errorMessage(err: unknown, fallback = "Something went wrong. Please try again.") {
  if (err instanceof ApiError) {
    if (err.status === 429) return "Too many requests right now. Please wait a moment and try again.";
    if (err.status === 503) return "The server is waking up or unreachable. Please retry in a few seconds.";
    return err.message || fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
