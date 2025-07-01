import express, { Router } from 'express';
import {
  createNewRoom,
  deleteRoomById,
  getAllRoomInTheater,
  getRoomById,
  updateRoomById,
} from '../controllers/room';

const router: Router = express.Router();

router
  .post('/', createNewRoom)
  .get('/all-room/:theaterId', getAllRoomInTheater)
  .get('/:id', getRoomById)
  .put('/:id', updateRoomById)
  .delete('/:id', deleteRoomById);

export default router;
