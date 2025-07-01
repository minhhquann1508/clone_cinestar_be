import { ErrorType } from './../config/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import Seat from '../models/Seat';
import { rowsCharacter } from '../utils/constant';

export const createAllSeatForRoom: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    next(ErrorType.emptyBody);
  }
  const { rows, cols, roomId } = req.body;
  if (!rows || !cols || !roomId || rows > 26) {
    res.status(400).json({ msg: 'Thiếu hoặc sai dữ liệu đầu vào' });
    return;
  }
  const seats = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 1; col <= cols; col++) {
      if (row === rows - 1 && col % 2 === 1 && col + 1 <= cols) {
        const groupId = `CP${row}-${col}`;
        seats.push(
          {
            room: roomId,
            row: rowsCharacter[row],
            col,
            seatType: 'couple',
            groupId,
          },
          {
            room: roomId,
            row: rowsCharacter[row],
            col: col + 1,
            seatType: 'couple',
            groupId,
          },
        );
        col++;
      } else {
        seats.push({
          room: roomId,
          row: rowsCharacter[row],
          col,
          seatType: 'standard',
        });
      }
    }
  }
  await Seat.insertMany(seats);
  res.status(201).json({ msg: 'Tạo danh sách ghế ngồi thành công' });
};

export const getAllSeatInRoom: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { roomId } = req.params;
  const seats = await Seat.find({ room: roomId });
  res.status(200).json({ seats });
};

export const updateSeatType: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    next(ErrorType.emptyBody);
  }
  const { id } = req.params;
  const { seatType } = req.body;
  const updatedSeat = await Seat.findByIdAndUpdate(
    id,
    { type: seatType },
    { new: true, runValidators: true },
  );
  res
    .status(200)
    .json({ msg: 'Cập nhật trạng thái ghế thành công', seat: updatedSeat });
};
