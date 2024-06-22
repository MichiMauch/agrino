import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import EmailStatus from '../../models/EmailStatus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const mongoose = await connectToDatabase();
      
      const statuses = await EmailStatus.find({}).exec();

      if (statuses.length > 0) {
        return res.status(200).json(statuses);
      } else {
        return res.status(404).json({ error: 'No email statuses found' });
      }
    } catch (error) {
      console.error('Error fetching email statuses:', error);
      return res.status(500).json({ error: `Unable to fetch data: ${error.message}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
