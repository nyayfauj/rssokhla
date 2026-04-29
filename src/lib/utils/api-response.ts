// ─── Standardized API Response Builder ──────────────────────

import { NextResponse } from 'next/server';
import type { ApiResponse, ApiError, PaginationMeta, HttpStatus } from '@/types/api.types';
import { HTTP_STATUS } from '@/types/api.types';

/**
 * Create a success response with data and optional pagination.
 */
export function successResponse<T>(
  data: T,
  meta?: PaginationMeta,
  status: HttpStatus = HTTP_STATUS.OK
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, meta },
    { status }
  );
}

/**
 * Create an error response with proper error structure.
 * Never exposes internal error details in production.
 */
export function errorResponse(
  code: string,
  message: string,
  status: HttpStatus = HTTP_STATUS.INTERNAL_ERROR,
  details?: string
): NextResponse<ApiResponse<never>> {
  const error: ApiError = {
    code,
    message,
    ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
  };

  return NextResponse.json(
    { success: false, error },
    { status }
  );
}

/**
 * Wrap an async handler with standardized error handling.
 */
export function withErrorHandling(
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error(`[API Error] ${request.url}:`, err);

      return errorResponse(
        'INTERNAL_ERROR',
        'Something went wrong. Please try again.',
        HTTP_STATUS.INTERNAL_ERROR,
        message
      );
    }
  };
}
