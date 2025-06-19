export const ERROR_CATALOG = {
  DB_UNAVAILABLE:    { status: 503, msg: 'Database service unavailable', error: 'Service temporarily unavailable' },
  DB_CONN_FAILED:    { status: 503, msg: 'Database connection failed', error: 'Unable to connect to database' },
  VALIDATION:        { status: 400, msg: 'Validation error', error: 'Invalid data' },
  JWT_INVALID:       { status: 401, msg: 'Invalid token', error: 'Authentication failed' },
  JWT_EXPIRED:       { status: 401, msg: 'Token expired', error: 'Please login again' },
  ID_INVALID:        { status: 400, msg: 'Invalid ID format', error: 'ID must be a valid number' },
  PARAMS_MISSING:    { status: 400, msg: 'Missing required parameters', error: 'Required parameters missing' },
  METHOD_NOT_ALLOWED:{ status: 405, msg: 'Method not allowed', error: 'Method not allowed for this endpoint' },
  NOT_FOUND:         { status: 404, msg: 'Resource not found', error: 'Endpoint not found' },
  DUPLICATE:         { status: 409, msg: 'Resource already exists', error: 'Duplicate entry found' },
  INVALID_REFERENCE: { status: 400, msg: 'Invalid reference', error: 'Referenced resource does not exist' },
  MISSING_FIELD:     { status: 400, msg: 'Missing required field', error: 'Required field is missing' },
  DEFAULT:           { status: 500, msg: 'Internal server error', error: 'Something went wrong' }
}; 