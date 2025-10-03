import { PrismaClient } from '@prisma/client';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../errors/ApiError.js';
import httpStatus from '../errors/httpStatus.js';

const prisma = new PrismaClient();

/**
 * Gets all notes for the authenticated user.
 */
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await prisma.note.findMany({
    where: { authorId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(notes);
});

/**
 * Creates a new note for the authenticated user.
 */
export const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Title and content are required.');
  }

  const newNote = await prisma.note.create({
    data: {
      title,
      content,
      authorId: req.userId,
    },
  });
  res.status(httpStatus.CREATED).json(newNote);
});

/**
 * Deletes a specific note for the authenticated user.
 */
export const deleteNote = asyncHandler(async (req, res) => {
  const { id: noteId } = req.params;

  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note || note.authorId !== req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found or not authorized.');
  }

  await prisma.note.delete({
    where: { id: noteId },
  });

  res.status(httpStatus.NO_CONTENT).send();
});