import bcrypt from 'bcryptjs';
import { ErrorType } from './../config/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import User from '../models/User';
import { FilterQuery } from 'mongoose';
import { generateAccessToken, generateRefreshToken } from '../middlewares/jwt';

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    next(ErrorType.emptyBody);
  }

  const isEmailExisting = await User.findOne({ email: req.body.email });

  if (isEmailExisting) {
    res.status(400).json({ msg: 'Tài khoản này đã được đăng ký trước đó' });
  }

  const user = await User.create({ ...req.body });

  const accessToken = generateAccessToken({
    id: user._id.toString(),
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id.toString(),
    role: user.role,
  });

  res.status(201).json({
    msg: 'Đăng ký tài khoản thành công',
    user,
    accessToken,
    refreshToken,
  });
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: 'Vui lòng cung cấp email và mật khẩu' });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ msg: 'Không tìm thấy người dùng' });
    return;
  }

  //Compare password
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    res.status(400).json({ msg: 'Email hoặc mật khẩu không chính xác' });
    return;
  }

  const accessToken = generateAccessToken({
    id: user._id.toString(),
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id.toString(),
    role: user.role,
  });

  res.status(200).json({
    msg: 'Đăng nhập thành công',
    user,
    accessToken,
    refreshToken,
  });
};
