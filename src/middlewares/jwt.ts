import jwt from 'jsonwebtoken';
import config from '../config/config';

interface UserDataType {
  id: string;
  role: string;
}

export const generateAccessToken = async (userData: UserDataType) => {
  return jwt.sign(userData, config.JWT_SECRET, { expiresIn: '30d' });
};

export const generateRefreshToken = async (userData: UserDataType) => {
  return jwt.sign(userData, config.JWT_SECRET, { expiresIn: '30d' });
};
