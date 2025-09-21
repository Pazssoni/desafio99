/**
 * @file Component that renders the three API-driven widgets.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { axiosInstance as axios } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FaCloudSun, FaGithub, FaStar } from 'react-icons/fa';

export default function ApiWidgets() {
  const { token } = useAuth();

  // State for all widgets
  const [pokemon, setPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingPokemon, setLoadingPokemon] = useState(true);
  const [weather, setWeather] = useState(null);
  const [githubUser, setGithubUser] = useState('facebook');
  const [repos, setRepos] = useState([]);
  const [loadingGithub, setLoadingGithub] = useState(false);
  
  const authHeader = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  /**
   * Fetches a new random Pokémon for the game, resetting the game state.
   */
  const fetchRandomPokemon = useCallback(async () => {
    setLoadingPokemon(true);
    setIsRevealed(false);
    setGuess('');
    setMessage('');
    try {
      const response = await axios.get('/api/widgets/pokemon', authHeader);
      setPokemon(response.data);
    } catch (error) { setMessage(error)}
    finally { setLoadingPokemon(false); }
  }, [authHeader]);

  useEffect(() => {
    if (!token) return;
    const fetchInitialData = async () => {
      try {
        const weatherRes = await axios.get('/api/widgets/weather', authHeader);
        setWeather(weatherRes.data);
      } catch (error) { console.error("Failed to fetch weather:", error); }
      fetchRandomPokemon();
    };
    fetchInitialData();
  }, [token, authHeader, fetchRandomPokemon]);

  /**
   * Handles the form submission for the Pokémon guessing game.
   * @param {React.FormEvent} e The form event.
   */
  const handleGuess = (e) => {
    e.preventDefault();
    if (!guess || !pokemon) return;
    const isCorrect = guess.toLowerCase().trim() === pokemon.name;
    setMessage(isCorrect ? `Correct! It's ${pokemon.name}!` : 'Wrong, try again!');
    if (isCorrect) {
      setIsRevealed(true);
      setTimeout(() => fetchRandomPokemon(), 3000);
    }
  };

  /**
   * Fetches GitHub repositories for the specified user.
   * @param {React.FormEvent} e The form event.
   */
  const handleFetchGithub = async (e) => {
    e.preventDefault();
    setLoadingGithub(true);
    try {
      const response = await axios.get(`/api/widgets/github?user=${githubUser}`, authHeader);
      setRepos(response.data);
    } catch (error) { setRepos(error); } 
    finally { setLoadingGithub(false); }
  };

  return (
    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
      <Box gridColumn={{ base: 'auto', lg: 'span 2' }} bg="gray.700" p={6} borderRadius="lg" boxShadow="lg">
        <Heading as="h2" size="lg" mb={4} color="cyan.400">Trainer's Challenge</Heading>
        <Skeleton isLoaded={!loadingPokemon} h="200px" mb={4} borderRadius="md">
          {pokemon && <Image src={pokemon.image} alt="Mystery Pokémon" boxSize="200px" mx="auto" filter={isRevealed ? 'none' : 'brightness(0)'} transition="filter 0.5s" />}
        </Skeleton>
        <Stack as="form" direction="row" onSubmit={handleGuess}>
          <Input placeholder="Enter the name" value={guess} onChange={e => setGuess(e.target.value)} disabled={isRevealed || loadingPokemon} />
          <Button type="submit" colorScheme="cyan" isLoading={loadingPokemon} isDisabled={isRevealed}>Guess!</Button>
        </Stack>
        {message && <Text mt={2} color={message.startsWith('Correct') ? 'green.300' : 'red.300'}>{message}</Text>}
      </Box>

      <Stack spacing={6}>
        <Box bg="gray.700" p={6} borderRadius="lg" boxShadow="lg">
          <Flex align="center" mb={2}>
            <FaCloudSun color="#4FD1C5" />
            <Heading as="h3" size="md" ml={2}>Weather</Heading>
          </Flex>
          <Skeleton isLoaded={!!weather}><Text>{weather ? `${weather.city}: ${weather.temperature}, ${weather.condition}` : 'Loading...'}</Text></Skeleton>
        </Box>
        <Box bg="gray.700" p={6} borderRadius="lg" boxShadow="lg">
           <Flex align="center" mb={4}>
            <FaGithub />
            <Heading as="h3" size="md" ml={2}>GitHub Repos</Heading>
          </Flex>
          <Stack as="form" direction="row" mb={4} onSubmit={handleFetchGithub}>
            <Input size="sm" value={githubUser} onChange={e => setGithubUser(e.target.value)} />
            <Button size="sm" type="submit" isLoading={loadingGithub}>Search</Button>
          </Stack>
          <Skeleton isLoaded={!loadingGithub}>
            <List spacing={2} maxHeight="150px" overflowY="auto">
              {repos.map(repo => <ListItem key={repo.id}><ListIcon as={FaStar} color="yellow.400" /> <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a></ListItem>)}
            </List>
          </Skeleton>
        </Box>
      </Stack>
    </SimpleGrid>
  );
}