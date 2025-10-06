/**
 * @file A widget for creating, displaying, and deleting user notes.
 */
import { useState, useEffect, useMemo } from 'react';
import { axiosInstance as axios } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  Textarea,
  Alert,
  AlertIcon,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

export default function NotesWidget() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const authHeader = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  useEffect(() => {
    if (!token) return;
    const fetchNotes = async () => {
      try {
        setError(null);
        const response = await axios.get('/notes', authHeader);
        setNotes(response.data);
      } catch (error){ setError(error);}
    };
    fetchNotes();
  }, [token, authHeader]);

  /**
   * Handles the form submission to create a new note.
   * @param {React.FormEvent} e The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      setError(null);
      const response = await axios.post('/notes', { title, content }, authHeader);
      setNotes(prevNotes => [response.data, ...prevNotes]);
      setTitle('');
      setContent('');
    } catch (error){  setError(error)};
  };

  /**
   * Handles the deletion of a note.
   * @param {string} noteId The ID of the note to be deleted.
   */
  const handleDelete = async (noteId) => {
    const originalNotes = [...notes];
    setNotes(prevNotes => prevNotes.filter((note) => note.id !== noteId));
    try {
      await axios.delete(`/notes/${noteId}`, authHeader);
    } catch (error){ 
      setError(error)
      setNotes(originalNotes);
    }
  };

  return (
    <Box bg="gray.700" p={6} borderRadius="lg" boxShadow="lg">
      <Heading as="h2" size="lg" mb={4} color="cyan.400">Quick Notes</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack as="form" spacing={4} onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input placeholder="Note title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Content</FormLabel>
            <Textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="cyan">Save Note</Button>
          {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
        </Stack>
        <Box maxHeight="400px" overflowY="auto" p={2}>
          {notes.length === 0 ? (
            <Text color="gray.400">No notes found. Create one!</Text>
          ) : (
            notes.map((note) => (
              <Box key={note.id} borderWidth="1px" borderColor="gray.600" borderRadius="md" p={4} mb={4} position="relative">
                <IconButton
                  icon={<FaTrash />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => handleDelete(note.id)}
                  aria-label="Delete note"
                />
                <Heading as="h4" size="md">{note.title}</Heading>
                <Text mt={2} whiteSpace="pre-wrap">{note.content}</Text>
              </Box>
            ))
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}