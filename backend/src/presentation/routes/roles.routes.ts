import { Router } from 'express';
import { RolesController } from '../controllers/roles.controller.js';

export class RolesRoutes {
  static routes(controller: RolesController): Router {
    const router = Router();

    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);

    return router;
  }
}
