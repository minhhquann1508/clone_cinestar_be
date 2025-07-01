import express, { Router } from 'express';
import {
  createAllSeatForRoom,
  getAllSeatInRoom,
  updateSeatType,
} from '../controllers/seat';

const router: Router = express.Router();

router
  .post('/', createAllSeatForRoom)
  .get('/:roomId', getAllSeatInRoom)
  .put('/:id', updateSeatType);

export default router;
