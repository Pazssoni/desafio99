import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { logout } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo! Você está logado.</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}