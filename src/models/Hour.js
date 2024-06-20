// models/Hour.js
import mongoose from 'mongoose';

const HourSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
  },
  user: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Hour || mongoose.model('Hour', HourSchema);
