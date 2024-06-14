import mongoose from 'mongoose';

const HourSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, 'Please provide the date'],
  },
  category: {
    type: String,
    required: [true, 'Please provide the category'],
  },
  hours: {
    type: Number,
    required: [true, 'Please provide the hours'],
  },
  user: {
    type: Number,
    required: [true, 'Please provide the user'],
  },
});

export default mongoose.models.Hour || mongoose.model('Hour', HourSchema);
