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
                console.log("Bemerkung im Backend beim Hinzufügen:", req.body.remarks); // Log the remarks in the backend when adding
                const hour = await Hour.create(req.body);
                res.status(201).json({ success: true, data: hour });
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;
        case 'PUT':
            try {
                const { id, hours, remarks } = req.body;
                console.log("Bemerkung im Backend beim Aktualisieren:", remarks); // Log the remarks in the backend when updating
                const updatedHour = await Hour.findByIdAndUpdate(id, { hours, remarks }, { new: true });
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
