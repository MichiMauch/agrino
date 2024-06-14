import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import Hour from '../../models/Hour';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const { user } = req.query;
        const hours = await Hour.find({ user });
        res.status(200).json({ success: true, data: hours });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'POST':
      try {
        const hour = await Hour.create(req.body);
        res.status(201).json({ success: true, data: hour });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'PUT':
      try {
        const { id, hours } = req.body;
        const updatedHour = await Hour.findByIdAndUpdate(id, { hours }, { new: true });
        res.status(200).json({ success: true, data: updatedHour });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        await Hour.findByIdAndDelete(id);
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
