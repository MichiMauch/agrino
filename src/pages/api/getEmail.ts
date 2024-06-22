import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import EmailStatus from '../../models/EmailStatus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = parseInt(req.query.userId as string, 10);
    const { month, year } = req.query;

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
      await connectToDatabase();
      const status = await EmailStatus.findOne({ userId, month, year }).sort({ sendTime: -1 }).exec();

      if (status) {
        return res.status(200).json(status);
      } else {
        return res.status(404).json({ error: 'No email status found for the given parameters' });
      }
    } catch (error) {
      console.error('Error fetching email status:', error);
      return res.status(500).json({ error: `Unable to fetch data: ${error.message}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
