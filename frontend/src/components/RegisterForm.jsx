import { useState } from 'react';
import axios from 'axios';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    try {
      const response = await axios.post('http://localhost:3333/api/auth/register', {
        name,
        email,
        password,
      });

      console.log('Usuário registrado:', response.data);
      alert('Usuário registrado com sucesso!');

    } catch (error) {
      console.error('Erro no registro:', error.response.data);
      alert('Erro ao registrar usuário. Verifique o console.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar</h3>
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha (mín. 8 caracteres)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
}