import mongoose from 'mongoose';
import slugify from 'slugify';

export interface MovieType {
  title: string;
  description?: string;
  duration?: number;
  rating?: number;
  trailerUrl?: string;
  posterUrl?: string;
  genres?: string[];
  directors?: string[];
  actors?: string[];
  country?: string;
  lang: 'Phụ đề' | 'Lồng tiếng' | 'Việt Nam';
  isHot?: boolean;
  releaseDate: Date;
  startDate: Date;
  endDate: Date;
  slug?: string;
  isHidden?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    duration: Number,
    rating: Number,
    trailerUrl: String,
    posterUrl: String,
    genres: [String],
    directors: [String],
    actors: [String],
    country: String,
    lang: {
      type: String,
      enum: ['Phụ đề', 'Lồng tiếng', 'Việt Nam'],
      required: true,
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    slug: String,
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

MovieSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();
  const slug = slugify(this.title, {
    replacement: '-',
    lower: true,
    strict: true,
  });
  this.slug = slug;
  next();
});

export default mongoose.model('Movie', MovieSchema);
