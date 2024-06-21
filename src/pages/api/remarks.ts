import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import Hour from '../../models/Hour';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    await connectToDatabase();

    if (method === 'PUT') {
        try {
            const { date, remarks } = req.body;
            const result = await Hour.updateMany({ date }, { remarks });
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error });
        }
    } else {
        res.status(400).json({ success: false });
    }
}
