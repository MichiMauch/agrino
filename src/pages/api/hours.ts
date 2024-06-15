// pages/api/hours.ts
import type { NextApiRequest, NextApiResponse } from 'next';
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
        const hours = await Hour.insertMany(req.body);
        res.status(201).json({ success: true, data: hours });
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
        console.log('Deleting entry with ID:', id);
        const deletedHour = await Hour.findByIdAndDelete(id);
        if (!deletedHour) {
          return res.status(404).json({ success: false, error: 'Entry not found' });
        }
        res.status(200).json({ success: true, data: deletedHour });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
