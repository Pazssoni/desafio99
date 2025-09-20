import { useState, useEffect, useMemo, useCallback } from 'react';
import { axiosInstance as axios } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: { display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' },
  mainWidget: { flex: '2 1 400px', border: '1px solid #333', padding: '1rem', borderRadius: '8px', minWidth: '300px' },
  sideWidgetsContainer: { flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '250px' },
  sideWidget: { border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' },
  pokemonImage: { width: '200px', height: '200px', margin: 'auto', display: 'block' },
};

export default function ApiWidgets() {
  const { token } = useAuth();
  const [pokemon, setPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingPokemon, setLoadingPokemon] = useState(true);
  const [weather, setWeather] = useState(null);
  const [githubUser, setGithubUser] = useState('reactjs');
  const [repos, setRepos] = useState([]);
  const [loadingGithub, setLoadingGithub] = useState(false);
  
  const authHeader = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  const fetchRandomPokemon = useCallback(async () => {
    setLoadingPokemon(true);
    setIsRevealed(false);
    setGuess('');
    setMessage('');
    try {
      const response = await axios.get('/api/widgets/pokemon', authHeader);
      setPokemon(response.data);
    } catch (error) {
      setMessage('Could not load a new Pokémon.', error);
    } finally {
      setLoadingPokemon(false);
    }
  }, [authHeader]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const weatherRes = await axios.get('/api/widgets/weather', authHeader);
        setWeather(weatherRes.data);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      }
      fetchRandomPokemon();
    };
    if (token) fetchInitialData();
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
    } catch (error) {
      setRepos([error]);
    } finally {
      setLoadingGithub(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainWidget}>
        <h2>Who's That Pokémon?</h2>
        {loadingPokemon ? <p>Drawing a Pokémon...</p> : pokemon && (
          <div>
            <img 
              src={pokemon.image} 
              alt="Mystery Pokémon" 
              style={{ ...styles.pokemonImage, filter: isRevealed ? 'none' : 'brightness(0)' }} 
            />
            <form onSubmit={handleGuess} style={{textAlign: 'center'}}>
              <input 
                type="text" 
                value={guess} 
                onChange={e => setGuess(e.target.value)} 
                placeholder="Enter the name"
                disabled={isRevealed}
                style={{width: '80%', padding: '8px', marginRight: '10px'}}
              />
              <button type="submit" disabled={isRevealed}>Guess!</button>
            </form>
            {message && <p style={{textAlign: 'center', marginTop: '10px'}}>{message}</p>}
          </div>
        )}
      </div>

      <div style={styles.sideWidgetsContainer}>
        <div style={styles.sideWidget}>
          <h3>Weather</h3>
          {weather ? <p>{weather.city}: {weather.temperature}, {weather.condition}</p> : <p>Loading...</p>}
        </div>
        <div style={styles.sideWidget}>
          <h3>GitHub Repos</h3>
          <form onSubmit={handleFetchGithub}>
            <input type="text" value={githubUser} onChange={e => setGithubUser(e.target.value)} />
            <button type="submit" disabled={loadingGithub}>{loadingGithub ? 'Searching...' : 'Search'}</button>
          </form>
          <ul style={{ maxHeight: '150px', overflowY: 'auto', paddingLeft: '20px' }}>
            {repos.map(repo => <li key={repo.id}><a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a></li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}