import { ErrorType } from './../config/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import Theater, { TheaterType } from '../models/Theater';
import { FilterQuery } from 'mongoose';

export const createTheater: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    next(ErrorType.emptyBody);
  }
  const theater = await Theater.create({ ...req.body });
  res.status(201).json({ msg: 'Tạo cụm rạp thành công', theater });
};

export const getAllTheater: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const queries: FilterQuery<TheaterType> = {};
  if (req.query.city) {
    queries.city = { $regex: req.query.city, $options: 'i' };
  }
  if (req.query.district) {
    queries.district = { $regex: req.query.district, $options: 'i' };
  }
  const theaters = await Theater.find(queries);
  res.status(200).json({ theaters });
};

export const getTheaterById: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const theater = await Theater.findById(id);
  res.status(200).json({ theater });
};

export const updateTheaterById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  if (!req.body) {
    next(ErrorType.emptyBody);
  }
  const updatedTheater = await Theater.findByIdAndUpdate(
    id,
    { ...req.body },
    { runValidators: true, new: true },
  );
  res
    .status(200)
    .json({ msg: 'Cập nhật cụm rạp thành công', theater: updatedTheater });
};

export const deleteTheaterById: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  await Theater.findByIdAndDelete(id);
  res.status(200).json({ msg: 'Xóa cụm rạp thành công' });
};
