import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

if (!apiKey || !databaseId) {
  console.error('❌ Missing APPWRITE_API_KEY or NEXT_PUBLIC_APPWRITE_DATABASE_ID in .env.local');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function safeCreateAttribute(collectionId: string, key: string, type: string, required: boolean = false, isArray: boolean = false, defaultValue: any = null) {
  try {
    console.log(`   - Adding attribute "${key}" to "${collectionId}" (${type})...`);
    
    // In Appwrite, required attributes CANNOT have a default value.
    // If a default value is provided, required must be false.
    const isRequired = defaultValue !== null ? false : required;

    switch (type) {
      case 'string':
        await databases.createStringAttribute(databaseId, collectionId, key, 2048, isRequired, defaultValue, isArray);
        break;
      case 'large-string':
        await databases.createStringAttribute(databaseId, collectionId, key, 32768, isRequired, defaultValue, isArray);
        break;
      case 'boolean':
        await databases.createBooleanAttribute(databaseId, collectionId, key, isRequired, defaultValue, isArray);
        break;
      case 'integer':
        await databases.createIntegerAttribute(databaseId, collectionId, key, isRequired, 0, 1000000, defaultValue, isArray);
        break;
      case 'float':
        await databases.createFloatAttribute(databaseId, collectionId, key, isRequired, -1000, 1000, defaultValue, isArray);
        break;
      case 'datetime':
        await databases.createDatetimeAttribute(databaseId, collectionId, key, isRequired, defaultValue, isArray);
        break;
    }
    console.log(`   ✅ Attribute "${key}" created.`);
  } catch (err: any) {
    if (err.code === 409) {
      console.log(`   ℹ️ Attribute "${key}" already exists.`);
    } else {
      console.error(`   ❌ Failed to create attribute "${key}":`, err.message);
    }
  }
}

async function setup() {
  console.log('🚀 Debugging Collection IDs...');
  try {
    const collections = await databases.listCollections(databaseId);
    console.log('Available Collections:');
    collections.collections.forEach(c => console.log(` - ${c.name}: ${c.$id}`));

    // Find the correct ID for operatives/users
    let userColId = process.env.NEXT_PUBLIC_COLLECTION_USERS || 'users';
    const userCol = collections.collections.find(c => c.name.toLowerCase() === 'operatives' || c.name.toLowerCase() === 'users');
    if (userCol) {
      userColId = userCol.$id;
      console.log(`🎯 Found Operatives/Users collection: ${userColId}`);
    }

    const COLLECTIONS = {
      INCIDENTS: process.env.NEXT_PUBLIC_COLLECTION_INCIDENTS || 'incidents',
      LOCATIONS: process.env.NEXT_PUBLIC_COLLECTION_LOCATIONS || 'locations',
      USERS: userColId,
      REPORTS: process.env.NEXT_PUBLIC_COLLECTION_REPORTS || 'reports',
      ALERTS: process.env.NEXT_PUBLIC_COLLECTION_ALERTS || 'alerts',
      PROFILES: process.env.NEXT_PUBLIC_COLLECTION_PROFILES || 'profiles',
    };

    console.log('\n🚀 Finishing Appwrite Database Setup...');

    // Retry failed attributes
    console.log('\n📦 Setting up Incidents (Retrying failed)...');
    await safeCreateAttribute(COLLECTIONS.INCIDENTS, 'isAnonymous', 'boolean', false, false, false);
    await safeCreateAttribute(COLLECTIONS.INCIDENTS, 'verificationCount', 'integer', false, false, 0);
    await safeCreateAttribute(COLLECTIONS.INCIDENTS, 'trustPoints', 'integer', false, false, 0);

    console.log('\n📦 Setting up Locations (Retrying failed)...');
    await safeCreateAttribute(COLLECTIONS.LOCATIONS, 'riskLevel', 'string', false, false, 'low');

    console.log('\n📦 Setting up Operatives...');
    await safeCreateAttribute(COLLECTIONS.USERS, 'verificationsProvided', 'integer', false, false, 0);
    await safeCreateAttribute(COLLECTIONS.USERS, 'lastActive', 'string', false);
    await safeCreateAttribute(COLLECTIONS.USERS, 'deviceId', 'string', false);
    await safeCreateAttribute(COLLECTIONS.USERS, 'areasMonitored', 'string', false, true);

    console.log('\n📦 Setting up Reports (Retrying failed)...');
    await safeCreateAttribute(COLLECTIONS.REPORTS, 'isVerified', 'boolean', false, false, false);

    console.log('\n✨ Database setup complete!');
  } catch (err: any) {
    console.error('❌ Setup failed:', err.message);
  }
}

setup();
