import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

export default function AuthPage() {
  
  const formContainerStyle = {
    display: 'flex',
    gap: '50px',
  };

  return (
    <div>
      <h2>Página de Autenticação</h2>
      <div style={formContainerStyle}>
        <RegisterForm />
        <LoginForm />
      </div>
    </div>
  );
}