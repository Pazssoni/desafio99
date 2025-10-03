import BaseError from './BaseError.js';
import httpStatus from './httpStatus.js'; 

class ApiError extends BaseError {
  constructor(statusCode, description = 'An error occurred', isOperational = true) {
    super('ApiError', statusCode, isOperational, description);
  }
}

export default ApiError;