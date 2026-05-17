/* eslint-disable no-unused-vars */
import response from '../utils/response.js';
import ClientError from '../exceptions/client-error.js';

const ErrorHandler = (err, _req, res, _next) => {
  if (err instanceof ClientError) return response(res, err.statusCode, err.message, null);
  if (err.isJoi) return response(res, 400, err.details[0], null);

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.log('Unhandled Error', err);
  return response(res, status, message, null);
};

export default ErrorHandler;
