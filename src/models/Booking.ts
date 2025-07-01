import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    seats: [
      {
        seat: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Seat',
          required: true,
        },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Booking', BookingSchema);
