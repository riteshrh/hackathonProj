import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': '670ad23f040495001a6f0b2a',
      'PLAID-SECRET': 'b2ac4b578642214f640356dfb573a4',
    },
  },
});

const client = new PlaidApi(config);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId } = req.body;

      const response = await client.linkTokenCreate({
        user: { client_user_id: userId },
        client_name: 'Horizon',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        language: 'en',
      });

      res.status(200).json({ link_token: response.data.link_token });
    } catch (error) {
      console.error('Error creating Plaid link token:', error);
      res.status(500).json({ error: 'Unable to create Plaid link token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
