import { Router } from 'express';
import { getGithubWidgetData, getPokemonWidgetData, getWeatherWidgetData } from '../controllers/widgets.controller.js';
// import { protect } from '../middlewares/auth.middleware.js'; // Deixe a importação, se quiser

const router = Router();

// router.use(protect); // <-- COMENTE ESTA LINHA TEMPORARIAMENTE

router.get('/github', getGithubWidgetData);

router.get('/pokemon', getPokemonWidgetData);

router.get('/weather', getWeatherWidgetData);

export default router;