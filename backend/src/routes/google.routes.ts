import { Router } from 'express';
import { GoogleAuthController } from '../controllers/GoogleAuthController';

export function createGoogleRoutes(controller = new GoogleAuthController()): Router {
  const router = Router();

  router.get('/start', controller.start);
  router.get('/callback', controller.callback);

  return router;
}
