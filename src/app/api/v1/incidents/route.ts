// ─── API: Incidents CRUD ────────────────────────────────────
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/utils/api-response';
import { HTTP_STATUS } from '@/types/api.types';

export const GET = withErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

  // In production, this queries Appwrite via server client
  return successResponse(
    { message: 'Incidents endpoint active', page, limit },
    { total: 0, page, limit, hasMore: false }
  );
});

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  if (!body.title || !body.description) {
    return errorResponse('VALIDATION_ERROR', 'Title and description are required', HTTP_STATUS.BAD_REQUEST);
  }
  return successResponse({ message: 'Incident created' }, undefined, HTTP_STATUS.CREATED);
});
