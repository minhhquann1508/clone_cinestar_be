import { ErrorType } from './../config/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import Movie, { MovieType } from '../models/Movie';
import { FilterQuery } from 'mongoose';

//Không có bao gồm update hình ảnh poster
export const createNewMovie: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    next(ErrorType.emptyBody);
  }

  let posterUrl = '';
  if (req.file) {
    const file = req.file;
    posterUrl = `http://localhost:3000/uploads/${file.filename}`;
  }
  const movie = await Movie.create({ ...req.body, posterUrl });
  res.status(201).json({ msg: 'Thêm phim thành công', movie });
};

export const getMovieById: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const movie = await Movie.findById(id);
  res.status(200).json({ movie });
};

export const getAllMovie: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const queries: FilterQuery<MovieType> = {};

  if (req.query.title) {
    queries.title = { $regex: req.query.title, options: 'i' };
  }

  if (req.query.isHot) {
    queries.title = { isHot: Boolean(req.query.isHot) };
  }

  const movies = await Movie.find(queries)
    .skip(skip)
    .limit(Number(limit))
    .sort({ releaseDate: -1 });

  const totalItems = await Movie.countDocuments(queries);

  res.status(200).json({
    movies,
    pagination: {
      page,
      limit,
      totalItems,
      totalPage: Math.ceil(totalItems / Number(limit)),
    },
  });
};

export const updateMovieById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  if (!req.body) {
    next(ErrorType.emptyBody);
  }
  const updatedMovie = await Movie.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true },
  );
  res
    .status(200)
    .json({ msg: 'Cập nhật phim thành công', movie: updatedMovie });
};

export const updateMoviePoster: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  if (!req.file) {
    res.status(400).json({ msg: 'Không tìm thấy file hình ảnh' });
    return;
  }

  const file = req.file;
  const posterUrl = `http://localhost:3000/uploads/${file.filename}`;
  const movie = await Movie.findById(id);
  if (!movie) {
    res.status(400).json({ msg: 'Không tìm thấy phim' });
    return;
  }

  movie.posterUrl = posterUrl;
  await movie.save();

  res.status(200).json({ msg: 'Cập nhật poster thành công', movie });
};

export const deleteMovieById: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  await Movie.findByIdAndDelete(id);
  res.status(200).json({ msg: 'Xóa phim thành công' });
};
