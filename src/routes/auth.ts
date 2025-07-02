import express, { Router } from 'express';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from '../controllers/auth';

const router: Router = express.Router();

router
  .post('/register', register)
  .post('/login', login)
  .post('/forgot-password', forgotPassword)
  .post('/reset-password', resetPassword);

export default router;
