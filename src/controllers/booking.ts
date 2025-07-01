import { ErrorType } from './../config/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import Booking from '../models/Booking';
import { FilterQuery } from 'mongoose';

interface CustomRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

export const createBooking = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    next(ErrorType.emptyBody);
  }
  const { id: userId } = req.user;
  const booking = await Booking.create({ ...req.body, user: userId });
  res.status(201).json({ msg: 'Đặt vé thành công', booking });
};
