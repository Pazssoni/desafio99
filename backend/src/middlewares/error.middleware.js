const errorHandler = (err, req, res, _next) => {
  let { statusCode, message } = err;

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode || 500).json({
    status: 'error',
    statusCode: statusCode || 500,
    message: message || 'An unexpected error occurred.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;