
import mongoose from 'mongoose';

const metroScheduleSchema = mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MetroRoute',
      required: true,
    },
    trainName: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    frequency: {
      type: Number, // in minutes
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MetroSchedule = mongoose.model('MetroSchedule', metroScheduleSchema);

export default MetroSchedule;
