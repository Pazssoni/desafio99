/**
 * @file Page component for user authentication (Login and Register).
 */
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

export default function AuthPage() {
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f0f2f5',
  };

  const formContainerStyle = {
    display: 'flex',
    gap: '50px',
    background: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };
  
  return (
    <div style={pageStyle}>
      <h1 style={{ marginBottom: '40px' }}>Project Dashboard</h1>
      <div style={formContainerStyle}>
        <RegisterForm />
        <LoginForm />
      </div>
    </div>
  );
}