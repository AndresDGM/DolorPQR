import { RequestHandler, Router } from 'express';
import { RolNombre } from '../../domain/entities/rol.entity.js';
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

export interface AppMiddlewares {
  authenticate: RequestHandler;
  authorize: (...rolesPermitidos: RolNombre[]) => RequestHandler;
}

export class AppRoutes {
  static routes(controllers: AppControllers, middlewares: AppMiddlewares): Router {
    const router = Router();

    router.get('/health', (_req, res) => {
      res.json({ status: 'ok', message: 'Servidor iniciado correctamente' });
    });

    router.use('/users', UsuariosRoutes.routes(controllers.usuariosController, middlewares));
    router.use('/roles', RolesRoutes.routes(controllers.rolesController, middlewares));
    router.use('/auth', AuthRoutes.routes(controllers.authController, middlewares));

    return router;
  }
}
