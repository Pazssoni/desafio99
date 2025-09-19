import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function NotesWidget() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const { token } = useAuth();

  // useMemo garante que o objeto do cabeçalho não seja recriado a cada renderização,
  // a menos que o próprio token mude.
  const authHeader = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  useEffect(() => {
    if (!token) return;

    const fetchNotes = async () => {
      try {
        setError(null);
        const response = await axios.get('http://localhost:3333/api/notes', authHeader);
        setNotes(response.data);
      } catch (err) {
        console.error('Falha ao buscar notas:', err);
        setError('Não foi possível carregar as notas.');
      }
    };

    fetchNotes();
  }, [token, authHeader]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      setError(null);
      const response = await axios.post('http://localhost:3333/api/notes', { title, content }, authHeader);
      
      // Atualização otimista da UI: adiciona a nova nota ao estado imediatamente.
      setNotes(prevNotes => [response.data, ...prevNotes]);
      
      // Limpa os campos do formulário
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Falha ao criar nota:', err);
      setError('Falha ao criar a nota.');
    }
  };

  const handleDelete = async (noteId) => {
    // Atualização otimista da UI: remove a nota do estado imediatamente.
    const originalNotes = [...notes];
    setNotes(prevNotes => prevNotes.filter((note) => note.id !== noteId));

    try {
      await axios.delete(`http://localhost:3333/api/notes/${noteId}`, authHeader);
    } catch (err) {
      console.error('Falha ao deletar nota:', err);
      setError('Falha ao deletar a nota. Restaurando lista.');
      // Reverte a alteração da UI se a chamada da API falhar.
      setNotes(originalNotes);
    }
  };

  return (
    <div style={{ border: '1px solid #333', padding: '1.5rem', marginTop: '1.5rem', borderRadius: '8px' }}>
      <h2>Minhas Notas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <textarea
          placeholder="Conteúdo..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px', fontFamily: 'inherit' }}
        />
        <button type="submit">Salvar Nota</button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
      
      <div>
        {notes.length === 0 ? (
          <p>Nenhuma nota encontrada.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
              <h3>{note.title}</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
              <button onClick={() => handleDelete(note.id)} style={{ background: 'transparent', border: '1px solid red', color: 'red', cursor: 'pointer' }}>
                Deletar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}