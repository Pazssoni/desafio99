/**
 * @file Page component for user authentication (Login and Register).
 */
import { Flex, Heading, Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

export default function AuthPage() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.800">
      <Box maxW="lg" w="full" bg="gray.700" boxShadow="2xl" rounded="lg" p={8}>
        <Heading fontSize="3xl" textAlign="center" mb={6}>Kortex</Heading>
        <Tabs isFitted variant="enclosed-colored" colorScheme="cyan">
          <TabList>
            <Tab _selected={{ color: 'white', bg: 'cyan.600' }} color="gray.400">Login</Tab>
            <Tab _selected={{ color: 'white', bg: 'cyan.600' }} color="gray.400">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><LoginForm /></TabPanel>
            <TabPanel><RegisterForm /></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
}