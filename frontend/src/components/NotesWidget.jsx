import { useState, useEffect, useMemo } from 'react';
import { axiosInstance as axios } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function NotesWidget() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const authHeader = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  useEffect(() => {
    if (!token) return;
    const fetchNotes = async () => {
      try {
        setError(null);
        const response = await axios.get('/api/notes', authHeader);
        setNotes(response.data);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
        setError('Could not load notes.');
      }
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
      const response = await axios.post('/api/notes', { title, content }, authHeader);
      setNotes(prevNotes => [response.data, ...prevNotes]);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Failed to create note:', err);
      setError('Failed to create note.');
    }
  };

  /**
   * Handles the deletion of a note.
   * @param {string} noteId The ID of the note to be deleted.
   */
  const handleDelete = async (noteId) => {
    const originalNotes = [...notes];
    setNotes(prevNotes => prevNotes.filter((note) => note.id !== noteId));
    try {
      await axios.delete(`/api/notes/${noteId}`, authHeader);
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note. Reverting changes.');
      setNotes(originalNotes);
    }
  };

  return (
    <div style={{ border: '1px solid #333', padding: '1.5rem', marginTop: '1.5rem', borderRadius: '8px' }}>
      <h2>My Notes</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <textarea
          placeholder="Content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px', fontFamily: 'inherit' }}
        />
        <button type="submit">Save Note</button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
      
      <div>
        {notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
              <h3>{note.title}</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
              <button onClick={() => handleDelete(note.id)} style={{ background: 'transparent', border: '1px solid red', color: 'red', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}