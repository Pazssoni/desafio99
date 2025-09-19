import { useAuth } from '../context/AuthContext';
import NotesWidget from '../components/NotesWidget';

export default function DashboardPage() {
  const { logout } = useAuth();
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={logout}>Sair</button>
      </div>
      <p>Bem-vindo! Você está logado.</p>
      <hr />
      <NotesWidget /> 

    </div>
  );
}