import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, PlaidApi, PlaidEnvironments, TransactionsGetResponse } from 'plaid';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { accessToken } = req.body;

    // Sanity check for access token
    if (!accessToken) {
      res.status(400).json({ error: 'Access token is required' });
      return;
    }

    try {
      // Fetch transaction data
      const response = await client.transactionsGet({
        access_token: accessToken,
        start_date: '2023-01-01', // Adjust date range as needed
        end_date: '2023-12-31',
        options: { count: 10 }, // Increase this count or handle pagination if needed
      });

      // Return the transaction data in response
      console.log(response);
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error fetching transactions:', error.response?.data || error.message);

      // Respond with a detailed error message from Plaid, if available
      res.status(500).json({
        error: error.response?.data?.error_message || 'Unable to fetch transactions. Please try again.',
      });
    }
  } else {
    // Handle non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
