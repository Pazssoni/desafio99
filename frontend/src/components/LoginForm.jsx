  /**
   * Handles the login form submission.
   * @param {React.FormEvent} e The form event.
   */
  import { useState } from 'react';
import { axiosInstance as axios } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, FormLabel, Input, Stack, Alert, AlertIcon } from '@chakra-ui/react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/login', { email, password });
      login(response.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack as="form" spacing={4} onSubmit={handleSubmit}>
      <FormControl id="login-email">
        <FormLabel>Email address</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </FormControl>
      <FormControl id="login-password">
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </FormControl>
      <Button type="submit" colorScheme="cyan" isLoading={isLoading} _hover={{ transform: 'scale(1.02)', boxShadow: 'md' }}>
        Login
      </Button>
      {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
    </Stack>
  );
}