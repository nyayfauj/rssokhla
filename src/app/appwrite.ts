import { Client, Account } from 'appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '69f1097f000ad36f6b04';

if (!endpoint || !projectId) throw new Error('Missing Appwrite endpoint and project ID');

export const client = new Client().setEndpoint(endpoint).setProject(projectId);
export const account = new Account(client);
export { ID } from 'appwrite';
