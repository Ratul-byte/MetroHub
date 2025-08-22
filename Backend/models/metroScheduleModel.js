import mongoose from 'mongoose';

const metroScheduleSchema = mongoose.Schema(
  {
    sourceStation: {
      type: String,
      required: true,
    },
    destinationStation: {
      type: String,
      required: true,
    },
    trainName: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    frequency: {
      type: Number, // in minutes
      required: true,
    },
    fare: {
      type: Number,
      required: false, // Not all schedules might have a fare initially
    },
  },
  {
    timestamps: true,
  }
);

const MetroSchedule = mongoose.model('MetroSchedule', metroScheduleSchema);

export default MetroSchedule;