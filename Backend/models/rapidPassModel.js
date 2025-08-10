import mongoose from 'mongoose';

const rapidPassSchema = new mongoose.Schema({
  rapidPassId: {
    type: Number,
    required: true,
    unique: true,
  },
  user: {
    type: String,
    required: true,
  },
});

export const RapidPass = mongoose.model('RapidPass', rapidPassSchema, 'rapidPasses');
