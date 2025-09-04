import mongoose from 'mongoose';

const metroStationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  },
  serial: {
    type: Number,
    required: true,
    unique: true
  }
}, {
  versionKey: '__v' // Explicitly set version key to __v (Mongoose default)
});

const MetroStation = mongoose.model('MetroStation', metroStationSchema);

export default MetroStation;