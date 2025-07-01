import mongoose from 'mongoose';

export interface TheaterType {
  name: string;
  location: string;
  phone: string;
  city: string;
  district: string;
}

const TheaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phone: String,
  city: String,
  district: String,
});

export default mongoose.model('Theater', TheaterSchema);
