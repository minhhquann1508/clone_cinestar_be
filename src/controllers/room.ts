import { ErrorType } from './../config/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { FilterQuery } from 'mongoose';
import Room from '../models/Room';

export const createNewRoom: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    next(ErrorType.emptyBody);
  }
  const room = await Room.create({ ...req.body });
  res.status(201).json({ msg: 'Tạo phòng chiếu thành công', room });
};

export const getAllRoomInTheater: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { theaterId } = req.params;
  const rooms = await Room.find({ theater: theaterId });
  res.status(200).json({ rooms });
};

export const getRoomById: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const room = await Room.findById(id);
  res.status(200).json({ room });
};

export const updateRoomById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  if (!req.body) {
    next(ErrorType.emptyBody);
  }
  const updatedRoom = await Room.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true },
  );
  res
    .status(201)
    .json({ msg: 'Cập nhật phòng chiếu thành công', room: updatedRoom });
};

export const deleteRoomById: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  await Room.findByIdAndDelete(id);
  res.status(200).json({ msg: 'Xóa phòng chiếu thành công' });
};
