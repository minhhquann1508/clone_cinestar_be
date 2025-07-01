import express, { Router } from 'express';
import {
  createTheater,
  deleteTheaterById,
  getAllTheater,
  getTheaterById,
  updateTheaterById,
} from '../controllers/theater';

const router: Router = express.Router();

router
  .get('/', getAllTheater)
  .post('/', createTheater)
  .get('/:id', getTheaterById)
  .put('/:id', updateTheaterById)
  .delete('/:id', deleteTheaterById);

export default router;
