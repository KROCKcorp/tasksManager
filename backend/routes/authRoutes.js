import { Router } from 'express';
import { userRegisteration, userLogin } from '../controllers/authController.js';

const router = Router();

router.post('/signup', userRegisteration);

router.post('/login', userLogin);

export default router;
