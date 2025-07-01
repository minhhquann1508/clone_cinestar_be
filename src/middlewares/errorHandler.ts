import e, { Request, Response, NextFunction } from 'express';
import { ErrorType } from '../config/error';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  if (typeof err === 'string' && err === ErrorType.emptyBody) {
    res.status(400).json({ msg: 'Không tìm thấy dữ liệu truyền vào' });
    return;
  }
  if (err.name === ErrorType.validationError) {
    res.status(400).json({ msg: 'Không được bỏ trống các trường bắt buộc' });
    return;
  }
  if (err.name === 'CastError') {
    res.status(400).json({ msg: 'Không tìm thấy id cần truyền' });
    return;
  }
  res.status(err.status || 500).json({
    err,
    msg: err.message || 'Internal Server Error',
  });
  return;
};
