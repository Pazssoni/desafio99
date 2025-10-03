import { Router } from 'express';
import { getGithubWidgetData, getPokemonWidgetData, getWeatherWidgetData } from '../controllers/widgets.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/widgets/github:
 * get:
 * summary: Get public repositories for a GitHub user
 * tags: [Widgets]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: user
 * required: true
 * schema: { type: string }
 * description: The GitHub username
 * responses:
 * '200': { description: 'A list of public repositories' }
 */
router.get('/github', getGithubWidgetData);

/**
 * @swagger
 * /api/widgets/pokemon:
 * get:
 * summary: Get a random Pokémon for the game
 * tags: [Widgets]
 * security:
 * - bearerAuth: []
 * responses:
 * '200': { description: 'Data for a random Pokémon' }
 */
router.get('/pokemon', getPokemonWidgetData);

/**
 * @swagger
 * /api/widgets/weather:
 * get:
 * summary: Get mock weather data
 * tags: [Widgets]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: city
 * schema: { type: string }
 * description: The city name (optional)
 * responses:
 * '200': { description: 'Mock weather data' }
 */
router.get('/weather', getWeatherWidgetData);

export default router;