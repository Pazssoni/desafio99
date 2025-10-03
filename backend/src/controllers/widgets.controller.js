import { widgetsService } from '../services/widgets.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../errors/ApiError.js';
import httpStatus from '../errors/httpStatus.js';

/**
 * Handles the request to get GitHub repositories.
 */
export const getGithubWidgetData = asyncHandler(async (req, res) => {
  const { user } = req.query;
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Parameter "user" is required.');
  }
  const repos = await widgetsService.getGithubRepos(user);
  res.json(repos);
});

/**
 * Handles the request to get a random Pokémon.
 */
export const getPokemonWidgetData = asyncHandler(async (req, res) => {
  const pokemon = await widgetsService.getRandomPokemon();
  res.json(pokemon);
});

/**
 * Handles the request to get mock weather data.
 */
export const getWeatherWidgetData = asyncHandler(async (req, res) => {
  const { city } = req.query;
  const mockWeather = {
    city: city || 'Lisbon',
    temperature: '19°C',
    condition: 'Partly Cloudy',
  };
  res.json(mockWeather);
});