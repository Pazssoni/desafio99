import { Router } from 'express';
import authRoutes from './auth.routes.js';
//import notesRoutes from './notes.routes.js';
//import widgetsRoutes from './widgets.routes.js';

const router = Router();

router.use('/auth', authRoutes);
//uter.use('/notes', notesRoutes);
//uter.use('/widgets', widgetsRoutes);

export default router;