import axios from 'axios';

/**
 * Fetches and transforms public repository data from the GitHub API.
 * @param {string} username The GitHub username.
 * @returns {Promise<object[]>} A list of formatted repository objects.
 */
const getGithubRepos = async (username) => {
  const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);

  const repos = response.data.map(repo => ({
    id: repo.id,
    name: repo.name,
    url: repo.html_url,
    stars: repo.stargazers_count,
  }));

  return repos;
};

/**
 * Fetches and transforms data for a random Pokémon from the PokeAPI.
 * @returns {Promise<object>} A formatted Pokémon data object.
 */
const getRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * 898) + 1;
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

  const pokemonData = {
    name: response.data.name,
    image: response.data.sprites.other['official-artwork'].front_default,
  };

  return pokemonData;
};

export const widgetsService = {
  getGithubRepos,
  getRandomPokemon,
};