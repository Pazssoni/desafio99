import { useState } from 'react';
import { axiosInstance as axios } from '../api/axios';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Handles the registration form submission.
   * @param {React.FormEvent} e The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/auth/register', { name, email, password });
      setSuccess('Registration successful! You can now log in.');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Register</h3>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          placeholder="Password (min. 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
      {error && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', fontSize: '14px', marginTop: '10px' }}>{success}</p>}
    </form>
  );
}