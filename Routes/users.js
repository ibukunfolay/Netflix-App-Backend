import express from 'express';
import verifyToken from '../utils/verifyToken';
import {
  userUpdate,
  userDelete,
  getUser,
  getAllUsers,
  monthlyStats,
} from '../controllers/users';

const router = express.Router();

router.get('/stats', monthlyStats);
router.put('/:id', verifyToken, userUpdate);
router.delete('/:id', verifyToken, userDelete);
router.get('/find/:id', verifyToken, getUser);
router.get('/:id', verifyToken, getAllUsers);

export default router;
