import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    plainTextPassword: {
      type: String,
      required: false,
    },
    securityAnswer: {
      type: String,
      required: true,
    },
    role: {
    type: String,
    default: 'user',
  },
  fine: {
    type: Number,
    default: 0,
  },
    rapidPassId: {
      type: String,
      unique: true,
      sparse: true,
    },
    preferredRoutes: {
      type: [String],
      default: [],
    },
    passBalance: {
      type: Number,
      default: 0,
    },
    tripsThisMonth: {
      type: Number,
      default: 0,
    },
    lastTripDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// This middleware will run before saving a user document
// It checks if at least one of the two fields is present.
userSchema.pre('save', function(next) {
  if (!this.email && !this.phoneNumber) {
    next(new Error('Either email or phone number must be provided.'));
  } else {
    next();
  }
});

export const User = mongoose.model('User', userSchema);