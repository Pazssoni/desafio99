import { Router } from 'express';
import authRoutes from './auth.routes.js';
import notesRoutes from './notes.routes.js';
import widgetsRoutes from './widgets.routes.js'; // Garante que está a ser importado

const router = Router();

router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);
router.use('/widgets', widgetsRoutes);

export default router;