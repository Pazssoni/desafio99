import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/refresh', refresh);

router.post('/logout', logout);

router.get('/test-route', (req, res) => {
  res.status(200).json({ message: 'A rota de teste do backend funcionou!' });
});


export default router;