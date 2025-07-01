import express, { Router } from 'express';
import {
  createNewMovie,
  deleteMovieById,
  getAllMovie,
  getMovieById,
  updateMovieById,
  updateMoviePoster,
} from '../controllers/movie';
import upload from '../config/upload';

const router: Router = express.Router();

router
  .get('/', getAllMovie)
  .post('/', createNewMovie)
  .put('/update-poster/:id', upload.single('file'), updateMoviePoster)
  .get('/:id', getMovieById)
  .put('/:id', updateMovieById)
  .delete('/:id', deleteMovieById);

export default router;
