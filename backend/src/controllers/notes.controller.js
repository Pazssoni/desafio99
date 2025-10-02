import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Gets all notes for the authenticated user.
 */
export const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { authorId: req.userId }, // req.userId is attached by the auth middleware
      orderBy: { createdAt: 'desc' },
    });
    res.json(notes);
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({ message: 'Error fetching notes.' });
  }
};

/**
 * Creates a new note for the authenticated user.
 */
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        authorId: req.userId,
      },
    });
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({ message: 'Error creating note.' });
  }
};

/**
 * Deletes a specific note for the authenticated user.
 */
export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.authorId !== req.userId) {
      return res.status(404).json({ message: 'Note not found or not authorized.' });
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Delete Note Error:', error);
    res.status(500).json({ message: 'Error deleting note.' });
  }
};