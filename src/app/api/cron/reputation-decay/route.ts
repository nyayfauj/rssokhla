import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';

export async function GET(req: Request) {
  // Security check for cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { databases } = createAdminClient();
    
    // In a real scenario, we'd query for operatives inactive for > 30 days.
    // For now, we simulate pulling all operatives and applying decay.
    const operatives = await databases.listDocuments(DATABASE_ID, COLLECTIONS.OPERATIVES);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let decayedCount = 0;

    for (const op of operatives.documents) {
      const lastActive = new Date(op.$updatedAt);
      if (lastActive < thirtyDaysAgo && op.reputation > 0) {
        // Decay reputation by 10%
        const newReputation = Math.max(0, Math.floor(op.reputation * 0.9));
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.OPERATIVES, op.$id, {
          reputation: newReputation
        });
        decayedCount++;
      }
    }

    return NextResponse.json({ success: true, decayedCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Decay failed' }, { status: 500 });
  }
}
