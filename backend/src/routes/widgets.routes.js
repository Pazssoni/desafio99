import { Router } from 'express';
import { getGithubWidgetData, getPokemonWidgetData, getWeatherWidgetData } from '../controllers/widgets.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/github', getGithubWidgetData);

router.get('/pokemon', getPokemonWidgetData);

router.get('/weather', getWeatherWidgetData);

export default router;