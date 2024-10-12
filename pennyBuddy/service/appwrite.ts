import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('670a1692003e48635bb7');

const account = new Account(client);
const databases = new Databases(client);

export { account, databases };