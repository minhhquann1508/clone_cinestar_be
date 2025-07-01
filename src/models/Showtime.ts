import mongoose from 'mongoose';

const ShowtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    startAt: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Showtime', ShowtimeSchema);
