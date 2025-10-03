import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/notes.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of notes
 *       '401':
 *         description: Unauthorized
 */
router.get('/', getNotes);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Note
 *               content:
 *                 type: string
 *                 example: This is the content of my note.
 *     responses:
 *       '201':
 *         description: Note created successfully
 *       '401':
 *         description: Unauthorized
 */
router.post('/', createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a specific note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note to delete
 *     responses:
 *       '204':
 *         description: Note deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Note not found
 */
router.delete('/:id', deleteNote);

export default router;
