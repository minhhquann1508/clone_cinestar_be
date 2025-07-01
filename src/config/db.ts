import mongoose from 'mongoose';
import config from './config';

export const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(config.DB_URL);
    if (conn.connection.readyState === 1) {
      console.log('Kết nối db thành công');
    }
  } catch (error) {
    console.log(error);
    console.log('Kết nối db thất bại');
  }
};
