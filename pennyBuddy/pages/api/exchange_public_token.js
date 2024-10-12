import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const config = new Configuration({
    basePath: PlaidEnvironments.sandbox, // Change this when moving to production
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
      const { public_token } = req.body;

      const tokenResponse = await client.itemPublicTokenExchange({
        public_token,
      });

      const { access_token, item_id } = tokenResponse.data;

      res.status(200).json({ access_token, item_id });
    } catch (error) {
      console.error('Error exchanging public token:', error.response?.data || error.message);
      res.status(500).json({ error: 'Unable to exchange public token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
