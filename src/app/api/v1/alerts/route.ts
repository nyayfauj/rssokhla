// ─── API: Alerts CRUD ───────────────────────────────────────
import { successResponse, errorResponse, withErrorHandling } from '@/lib/utils/api-response';
import { HTTP_STATUS } from '@/types/api.types';

export const GET = withErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const active = searchParams.get('active') === 'true';
  return successResponse({ message: 'Alerts endpoint active', active });
});

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  if (!body.title || !body.message) {
    return errorResponse('VALIDATION_ERROR', 'Title and message are required', HTTP_STATUS.BAD_REQUEST);
  }
  return successResponse({ message: 'Alert created' }, undefined, HTTP_STATUS.CREATED);
});
