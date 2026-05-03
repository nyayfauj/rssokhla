'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/appwrite/server';
import { COLLECTIONS, DATABASE_ID } from '@/lib/appwrite/collections';
import { ID } from 'node-appwrite';

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  aliases: z.array(z.string()).optional(),
  fatherName: z.string().optional(),
  ageEstimate: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  height: z.string().optional(),
  build: z.string().optional(),
  marks: z.string().optional(),
  phones: z.array(z.string()).optional(),
  emails: z.array(z.string().email()).optional(),
  socialEntries: z.array(z.string()).optional(),
  currentAddress: z.string().optional(),
  currentArea: z.string().optional(),
  previousAddress: z.string().optional(),
  frequentLocations: z.array(z.string()).optional(),
  rank: z.string(),
  affiliations: z.array(z.string()).optional(),
  shakhaLocation: z.string().optional(),
  shakhaTimings: z.string().optional(),
  involvementSince: z.string().optional(),
  activities: z.array(z.string()).optional(),
  threatLevel: z.string(),
  currentOccupation: z.string().optional(),
  employer: z.string().optional(),
  previousOccupation: z.string().optional(),
  vehicleType: z.string().optional(),
  vehicleNumber: z.string().optional(),
  vehicleDesc: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.literal('active')
});

export async function createProfile(formData: unknown) {
  try {
    // 1. Validate payload with Zod
    const validatedData = profileSchema.parse(formData);

    // 2. Initialize secure server client
    const { databases } = createAdminClient();

    // 3. Create document in Appwrite securely from the server
    const profile = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.PROFILES,
      ID.unique(),
      validatedData
    );

    return { success: true, profileId: profile.$id };
  } catch (error) {
    console.error('Server Action Error (createProfile):', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.flatten().fieldErrors };
    }
    return { success: false, error: 'Internal Server Error' };
  }
}
