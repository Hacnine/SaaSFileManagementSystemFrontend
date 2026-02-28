import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

/**
 * Extract a user-friendly message from an RTK Query error.
 */
export function getErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback = 'Something went wrong.',
): string {
  if (!error) return fallback;

  if ('status' in error) {
    // FetchBaseQueryError
    const data = error.data as { message?: string } | undefined;
    return data?.message || fallback;
  }

  // SerializedError
  return error.message || fallback;
}
