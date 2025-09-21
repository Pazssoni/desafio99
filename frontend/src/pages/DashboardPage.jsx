/**
 * @file The main dashboard page, visible only to authenticated users.
 */
import { useAuth } from '../context/AuthContext';
import NotesWidget from '../components/NotesWidget';
import ApiWidgets from '../components/ApiWidgets';
import {
  Container,
  Flex,
  Heading,
  Button,
  Divider,
} from '@chakra-ui/react';

export default function DashboardPage() {
  const { logout } = useAuth();
  return (
    <Container maxW="container.xl" py={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading as="h1" color="cyan.400">Kortex</Heading>
        <Button onClick={logout} colorScheme="red" variant="outline">Logout</Button>
      </Flex>
      <ApiWidgets />
      <Divider my={8} borderColor="gray.600" />
      <NotesWidget />
    </Container>
  );
}