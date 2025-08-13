import mongoose from 'mongoose';

const metroStationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MetroStation = mongoose.model('MetroStation', metroStationSchema);

export default MetroStation;