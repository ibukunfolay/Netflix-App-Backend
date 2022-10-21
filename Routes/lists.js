import { Router } from 'express';
import verifyToken from '../utils/verifyToken';
import { createList, deleteList, getList } from '../controllers/lists';

const router = Router();

router.get('/', verifyToken, getList);
router.delete('/:id', verifyToken, deleteList);
router.post('/create', verifyToken, createList);

export default router;
