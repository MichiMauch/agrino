import mongoose from 'mongoose';

const EmailStatusSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: String, required: true },
  sendTime: { type: Date, required: true },
});

const EmailStatus = mongoose.models.EmailStatus || mongoose.model('EmailStatus', EmailStatusSchema);

export default EmailStatus;
