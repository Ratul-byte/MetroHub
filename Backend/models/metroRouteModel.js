
import mongoose from 'mongoose';

const metroRouteSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    stations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MetroStation',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MetroRoute = mongoose.model('MetroRoute', metroRouteSchema);

export default MetroRoute;
