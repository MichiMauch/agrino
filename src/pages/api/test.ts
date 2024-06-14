import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    res.status(200).json({ success: true, message: 'Successfully connected to MongoDB' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to connect to MongoDB', error: error.message });
  }
}
