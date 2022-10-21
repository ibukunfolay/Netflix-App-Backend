import { Router } from 'express';
import verifyToken from '../utils/verifyToken';
import {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovie,
  getRandomMovie,
  getAllMovies,
} from '../controllers/movies';

const router = Router();

router.get('/find/:id', getMovie);
router.get('/all', verifyToken, getAllMovies);
router.post('/create', verifyToken, createMovie);
router.post('/update', verifyToken, updateMovie);
router.post('/delete', verifyToken, deleteMovie);
router.get('/random', verifyToken, getRandomMovie);

export default router;
