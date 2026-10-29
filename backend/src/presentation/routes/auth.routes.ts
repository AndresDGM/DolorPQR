import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export class AuthRoutes {
  static routes(controller: AuthController): Router {
    const router = Router();

    router.post('/login', controller.login);

    return router;
  }
}
