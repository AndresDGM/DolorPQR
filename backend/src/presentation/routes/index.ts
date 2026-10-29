import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { RolesController } from '../controllers/roles.controller.js';
import { UsuariosController } from '../controllers/usuarios.controller.js';
import { AuthRoutes } from './auth.routes.js';
import { RolesRoutes } from './roles.routes.js';
import { UsuariosRoutes } from './usuarios.routes.js';

export interface AppControllers {
  usuariosController: UsuariosController;
  rolesController: RolesController;
  authController: AuthController;
}

export class AppRoutes {
  static routes(controllers: AppControllers): Router {
    const router = Router();

    router.get('/health', (_req, res) => {
      res.json({ status: 'ok', message: 'Servidor iniciado correctamente' });
    });

    router.use('/users', UsuariosRoutes.routes(controllers.usuariosController));
    router.use('/roles', RolesRoutes.routes(controllers.rolesController));
    router.use('/auth', AuthRoutes.routes(controllers.authController));

    return router;
  }
}
