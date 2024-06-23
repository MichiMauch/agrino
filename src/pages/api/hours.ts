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
                const hour = await Hour.create(req.body);
                res.status(201).json({ success: true, data: hour });
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;
        case 'PUT':
            try {
                const { id, hours, remarks, date, meal, value } = req.body;
                if (id) {
                    const update = { hours, remarks };
                    if (meal) update[meal] = value;
                    const updatedHour = await Hour.findByIdAndUpdate(id, update, { new: true });
                    res.status(200).json({ success: true, data: updatedHour });
                } else if (date && remarks !== undefined) {
                    const result = await Hour.updateMany({ date }, { remarks });
                    res.status(200).json({ success: true, data: result });
                } else if (date && meal !== undefined) {
                    const update = { [meal]: value };
                    const result = await Hour.updateMany({ date }, update);
                    res.status(200).json({ success: true, data: result });
                } else {
                    throw new Error('Invalid request');
                }
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case 'DELETE':
            try {
                const { id } = req.query;
                const deletedHour = await Hour.findByIdAndDelete(id);
                res.status(200).json({ success: true, data: deletedHour });
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
