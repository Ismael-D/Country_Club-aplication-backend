import { errorCatalog } from './error.catalog.js';

export function buildErrorResponse({ code = 'DEFAULT', errors = null, customMsg = null, customError = null }) {
  const { status, msg, error } = errorCatalog[code] || errorCatalog.DEFAULT;
  const response = {
    ok: false,
    msg: customMsg || msg,
    error: customError || error
  };
  if (errors) response.errors = errors;
  return { status, body: response };
} 