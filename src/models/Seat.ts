import mongoose from 'mongoose';

const SeatSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    row: { type: String, required: true },
    col: { type: Number, required: true },
    seatType: {
      type: String,
      enum: ['standard', 'vip', 'couple'],
      default: 'standard',
    },
    groupId: String,
  },
  { timestamps: true },
);

export default mongoose.model('Seat', SeatSchema);
