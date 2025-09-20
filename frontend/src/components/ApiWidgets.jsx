import { useState, useEffect, useMemo, useCallback } from 'react';
import { axiosInstance as axios } from '../api/axios';
import { useAuth } from '../context/AuthContext';


const styles = {
  container: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  mainWidget: { flex: 2, border: '1px solid #333', padding: '1rem', borderRadius: '8px' },
  sideWidgetsContainer: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
  sideWidget: { border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' },
  pokemonImage: { width: '200px', height: '200px', margin: 'auto', display: 'block' },
};

export default function ApiWidgets() {
  const { token } = useAuth();

  // Estados do Jogo Pokémon
  const [pokemon, setPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingPokemon, setLoadingPokemon] = useState(true);

  // Estados dos outros widgets
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
      console.error('Não foi possível carregar um novo Pokémon.', error);
    } finally {
      setLoadingPokemon(false);
    }
  }, [authHeader]);

  // Busca dados iniciais ao montar o componente
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const weatherRes = await axios.get('/api/widgets/weather', authHeader);
        setWeather(weatherRes.data);
      } catch (error) {
        console.error("Falha ao buscar clima:", error);
      }
      fetchRandomPokemon();
    };
    if (token) fetchInitialData();
  }, [token, authHeader, fetchRandomPokemon]);

  const handleGuess = (e) => {
    e.preventDefault();
    if (!guess || !pokemon) return;

    // Normaliza a resposta do usuário para comparação
    const isCorrect = guess.toLowerCase().trim() === pokemon.name;
    setMessage(isCorrect ? `Correto! É o ${pokemon.name}!` : 'Errado, tente novamente!');

    if (isCorrect) {
      setIsRevealed(true);
      // Prepara um novo desafio após um tempo
      setTimeout(() => {
        fetchRandomPokemon();
      }, 3000); // 3 segundos
    }
  };

  const handleFetchGithub = async (e) => {
    e.preventDefault();
    setLoadingGithub(true);
    try {
      const response = await axios.get(`/api/widgets/github?user=${githubUser}`, authHeader);
      setRepos(response.data);
    }      catch (error) {
  console.error("Falha ao buscar repositórios:", error);
      setRepos([]);
    } finally {
      setLoadingGithub(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Pokémon Widget (Destaque) */}
      <div style={styles.mainWidget}>
        <h2>Quem é esse Pokémon?</h2>
        {loadingPokemon ? <p>Sorteando um Pokémon...</p> : pokemon && (
          <div>
            <img 
              src={pokemon.image} 
              alt="Pokémon misterioso" 
              style={{ ...styles.pokemonImage, filter: isRevealed ? 'none' : 'brightness(0)' }} 
            />
            <form onSubmit={handleGuess}>
              <input 
                type="text" 
                value={guess} 
                onChange={e => setGuess(e.target.value)} 
                placeholder="Digite o nome"
                disabled={isRevealed}
                style={{width: '100%', padding: '8px'}}
              />
              <button type="submit" disabled={isRevealed} style={{marginTop: '10px'}}>Adivinhar!</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        )}
      </div>

      {/* Widgets Laterais */}
      <div style={styles.sideWidgetsContainer}>
        <div style={styles.sideWidget}>
          <h3>Clima</h3>
          {weather ? <p>{weather.city}: {weather.temperature}, {weather.condition}</p> : <p>Carregando...</p>}
        </div>

        <div style={styles.sideWidget}>
          <h3>Repos do GitHub</h3>
          <form onSubmit={handleFetchGithub}>
            <input type="text" value={githubUser} onChange={e => setGithubUser(e.target.value)} />
            <button type="submit" disabled={loadingGithub}>{loadingGithub ? 'Buscando...' : 'Buscar'}</button>
          </form>
          <ul style={{ maxHeight: '150px', overflowY: 'auto', paddingLeft: '20px' }}>
            {repos.map(repo => <li key={repo.id}><a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a></li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}