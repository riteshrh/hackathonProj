import { AccountsGetResponse, Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

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

export default async function handler(req: { method: string; body: { accessToken: string }; }, res: { status: (statusCode: number) => { json: (data: any) => void }; setHeader: (name: string, value: string[]) => void; end: (data: string) => void }) {
  if (req.method === 'POST') {
    try {
      const { accessToken } = req.body; 

      if (!accessToken) {
        res.status(400).json({ error: 'Missing access token' });
        return;
      }

      const response = await client.accountsBalanceGet({
        access_token: accessToken,
      });

      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error fetching balance:', error.response?.data || error.message);

      if (error.response && error.response.data) {
        res.status(error.response.status).json({
          error: error.response.data.error_message || 'An error occurred while fetching balance.',
        });
      } else {
        res.status(500).json({
          error: 'An internal server error occurred',
        });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
  }
}
