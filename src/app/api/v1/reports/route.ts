// ─── API: Reports ───────────────────────────────────────────
import { successResponse, errorResponse, withErrorHandling } from '@/lib/utils/api-response';
import { HTTP_STATUS } from '@/types/api.types';

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  if (!body.incidentId || !body.content) {
    return errorResponse('VALIDATION_ERROR', 'incidentId and content are required', HTTP_STATUS.BAD_REQUEST);
  }
  return successResponse({ message: 'Report submitted' }, undefined, HTTP_STATUS.CREATED);
});
