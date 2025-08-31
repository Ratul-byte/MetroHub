import mongoose from 'mongoose';

const ticketSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        schedule: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'MetroSchedule',
        },
        paymentStatus: {
            type: String,
            required: true,
            default: 'pending',
        },
        transactionId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        qrCode: {
            type: String,
            required: false, // Will be generated after successful payment
        },
        rawResponse: {
            type: Object,
            required: false,
        },
    },
    {
        createdAt: {
    type: Date,
    default: Date.now,
  },
  journeyStartTime: {
    type: Date,
  },
  journeyEndTime: {
    type: Date,
  },
  fine: {
    type: Number,
    default: 0,
  },
  scannedAt: {
    type: Date,
  },
    }
);

export default mongoose.model('Ticket', ticketSchema);
