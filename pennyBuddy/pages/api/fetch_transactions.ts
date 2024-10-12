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

export default async function handler(req: { method: string; body: { accessToken: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: TransactionsGetResponse): void; new(): any; }; end: { (arg0: string): void; new(): any; }; }; setHeader: (arg0: string, arg1: string[]) => void; }) {
  if (req.method === 'POST') {
    try {
      const { accessToken } = req.body;

      const response = await client.transactionsGet({
        access_token: accessToken,
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        options: { count: 10 },
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Unable to fetch transactions' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
