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
  morningMeal: {
    type: Boolean,
    default: false
  },
  lunchMeal: {
      type: Boolean,
      default: false
  },
  eveningMeal: {
      type: Boolean,
      default: false
  }
});

export default mongoose.models.Hour || mongoose.model('Hour', HourSchema);
