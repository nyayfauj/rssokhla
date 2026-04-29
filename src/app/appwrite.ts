import { Client, Account } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '';

if (!endpoint || !projectId) throw new Error('Missing Appwrite endpoint and project ID');

export const client = new Client().setEndpoint(endpoint).setProject(projectId);
export const account = new Account(client);
export { ID } from 'appwrite';
