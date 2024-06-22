import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, month, year } = req.query;

  if (!userId || !month || !year) {
    return res.status(400).json({ error: 'Missing userId, month, or year query parameters' });
  }

  try {
    const { db } = await connectToDatabase();
    const emailLog = await db.collection('emailLogs').findOne({ userId: parseInt(userId as string), month, year });

    if (emailLog) {
      res.status(200).json({
        emailSent: emailLog.emailSent,
        sentTimestamp: emailLog.sentTimestamp,
      });
    } else {
      res.status(200).json({
        emailSent: false,
        sentTimestamp: null,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
