import BaseError from './BaseError.js';

class ApiError extends BaseError {
  constructor(statusCode, description = 'An error occurred', isOperational = true) {
    super('ApiError', statusCode, isOperational, description);
  }
}

export default ApiError;