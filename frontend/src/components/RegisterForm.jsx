  /**
   * Handles the registration form submission.
   * @param {React.FormEvent} e The form event.
   */
import { useState } from 'react';
import { axiosInstance as axios } from '../api/axios';
import { Button, FormControl, FormLabel, Input, Stack, Alert, AlertIcon } from '@chakra-ui/react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await axios.post('/api/auth/register', { name, email, password });
      setSuccess('Registration successful! Please switch to the Login tab.');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack as="form" spacing={4} onSubmit={handleSubmit}>
      <FormControl id="register-name">
        <FormLabel>Name</FormLabel>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </FormControl>
      <FormControl id="register-email">
        <FormLabel>Email address</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </FormControl>
      <FormControl id="register-password">
        <FormLabel>Password</FormLabel>
        <Input type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </FormControl>
      <Button type="submit" colorScheme="cyan" variant="outline" isLoading={isLoading} _hover={{ bg: 'cyan.500', color: 'white' }}>
        Register
      </Button>
      {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
      {success && <Alert status="success" borderRadius="md"><AlertIcon />{success}</Alert>}
    </Stack>
  );
}