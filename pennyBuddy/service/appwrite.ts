import { Client, Account } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('670a1692003e48635bb7');

export const account = new Account(client);
