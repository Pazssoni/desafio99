import { widgetsService } from '../services/widgets.service.js';

/**
 * Handles the request to get GitHub repositories.
 */
export const getGithubWidgetData = async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({ message: 'Parameter "user" is required.' });
    }
    const repos = await widgetsService.getGithubRepos(user);
    res.json(repos);
  } catch (error) {
    console.error('GitHub Widget Error:', error);
    res.status(error.response?.status || 500).json({ message: 'Error fetching GitHub repositories.' });
  }
};

/**
 * Handles the request to get a random Pokémon.
 */
export const getPokemonWidgetData = async (req, res) => {
  try {
    const pokemon = await widgetsService.getRandomPokemon();
    res.json(pokemon);
  } catch (error) {
    console.error('Pokémon Widget Error:', error);
    res.status(error.response?.status || 500).json({ message: 'Error fetching Pokémon data.' });
  }
};

/**
 * Handles the request to get mock weather data.
 */
export const getWeatherWidgetData = (req, res) => {
  const { city } = req.query;
  const mockWeather = {
    city: city || 'Lisbon',
    temperature: '19°C',
    condition: 'Partly Cloudy',
  };
  res.json(mockWeather);
};