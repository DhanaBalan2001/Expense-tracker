// Custom Error Class
export class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Async Handler Wrapper
  export const catchAsync = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
  
  // Error Handler Middleware
  export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
      const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      err.message = `Duplicate field value: ${value}. Please use another value!`;
      err.statusCode = 400;
    }
  
    // MongoDB Validation Error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      err.message = `Invalid input data. ${errors.join('. ')}`;
      err.statusCode = 400;
    }
  
    // MongoDB Cast Error
    if (err.name === 'CastError') {
      err.message = `Invalid ${err.path}: ${err.value}`;
      err.statusCode = 400;
    }
  
    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
      err.message = 'Invalid token. Please log in again!';
      err.statusCode = 401;
    }
    if (err.name === 'TokenExpiredError') {
      err.message = 'Your token has expired! Please log in again.';
      err.statusCode = 401;
    }
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  