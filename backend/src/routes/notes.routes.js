import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/notes.controller.js';
// import { protect } from '../middlewares/auth.middleware.js'; // Deixe a importação, se quiser

const router = Router();

// router.use(protect); // <-- COMENTE ESTA LINHA TEMPORARIAMENTE

router.get('/', getNotes);

router.post('/', createNote);

router.delete('/:id', deleteNote);

export default router;
