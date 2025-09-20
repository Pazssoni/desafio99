/**
 * @file The main dashboard page, visible only to authenticated users.
 */
import { useAuth } from '../context/AuthContext';
import NotesWidget from '../components/NotesWidget';
import ApiWidgets from '../components/ApiWidgets';

export default function DashboardPage() {
  const { logout } = useAuth();
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>
      <ApiWidgets />
      <NotesWidget />
    </div>
  );
}