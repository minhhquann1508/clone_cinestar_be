import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ErrorType } from './../config/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import User from '../models/User';
import { FilterQuery } from 'mongoose';
import { generateAccessToken, generateRefreshToken } from '../middlewares/jwt';
import sendEmail from '../utils/sendMail';

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

export const forgotPassword: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ msg: 'Không tìm thấy email' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ msg: 'Không tìm thấy người dùng' });
    return;
  }

  const resetPasswordToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordExp = Date.now() + 15 * 60 * 1000;
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpires = new Date(resetPasswordExp);
  await user.save();

  const resetLink = `http://localhost:3000/change-pass?token=${resetPasswordToken}&email=${email}`;
  const html = `<a href="${resetLink}">Nhấn vào đây để cấp lại mật khẩu</a>`;
  const isSendEmail = await sendEmail(
    user.email as string,
    'Cập nhật mật khẩu',
    html,
  );

  if (!isSendEmail) {
    res.status(400).json({ msg: 'Gửi mail không thành công' });
    return;
  }

  res.status(200).json({
    msg: 'Email thay đổi mật khẩu đã được gửi. Hãy kiểm tra email của bạn nhé',
  });
};

export const resetPassword: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password, token } = req.body;
  if (!email || !password || !token)
    res.status(400).json({ msg: 'Cập nhật mật khẩu không thành công' });

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ msg: 'Không tìm thấy người dùng' });
    return;
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    res.status(400).json({ msg: 'Email hoặc mật khẩu không chính xác' });
    return;
  }

  if (user.resetPasswordToken !== token) {
    res.status(400).json({ msg: 'Token không chính xác' });
    return;
  }

  if (
    user.resetPasswordExpires &&
    user.resetPasswordExpires.getTime() < Date.now()
  ) {
    res.status(400).json({
      msg: 'Bạn chỉ có thể cập nhật mật khẩu trong vòng 15 phút. Vui lòng thử lại',
    });
    return;
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.status(200).json({
    msg: 'Cập nhật mật khẩu thành công',
  });
};
