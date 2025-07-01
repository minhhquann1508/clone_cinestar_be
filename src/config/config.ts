import dotenv from 'dotenv';

dotenv.config({ debug: false });

interface Config {
  port: number;
  nodeEnv: string;
  DB_URL: string;
  JWT_SECRET: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/cinestar',
  JWT_SECRET: process.env.JWT_SECRET || '',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
};

export default config;
