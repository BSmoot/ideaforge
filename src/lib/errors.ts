export class IdeaForgeError extends Error {
  public readonly code: string;
  public readonly context: Record<string, unknown>;
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    code: string,
    context: Record<string, unknown> = {},
    isRetryable = false
  ) {
    super(message);
    this.name = 'IdeaForgeError';
    this.code = code;
    this.context = context;
    this.isRetryable = isRetryable;
  }
}

export class DatabaseError extends IdeaForgeError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, 'DATABASE_ERROR', context, true);
    this.name = 'DatabaseError';
  }
}

export class AIServiceError extends IdeaForgeError {
  constructor(
    message: string,
    context: Record<string, unknown> = {},
    isRetryable = true
  ) {
    super(message, 'AI_SERVICE_ERROR', context, isRetryable);
    this.name = 'AIServiceError';
  }
}

export class ValidationError extends IdeaForgeError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, 'VALIDATION_ERROR', context, false);
    this.name = 'ValidationError';
  }
}

export class ExportError extends IdeaForgeError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, 'EXPORT_ERROR', context, true);
    this.name = 'ExportError';
  }
}
