import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Room', roomSchema);
