// ─── API: Locations ─────────────────────────────────────────
import { successResponse, withErrorHandling } from '@/lib/utils/api-response';
import { OKHLA_AREAS } from '@/types/location.types';

export const GET = withErrorHandling(async () => {
  const areas = Object.entries(OKHLA_AREAS).map(([key, area]) => ({
    id: key,
    label: area.label,
    center: area.center,
  }));
  return successResponse(areas);
});
