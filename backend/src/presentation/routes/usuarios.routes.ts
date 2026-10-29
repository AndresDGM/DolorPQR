import { Router } from 'express';
import { UsuariosController } from '../controllers/usuarios.controller.js';

export class UsuariosRoutes {
  static routes(controller: UsuariosController): Router {
    const router = Router();

    router.get('/', controller.getAll);
    router.get('/rol/:rol', controller.getByRol);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.patch('/:id/activo', controller.setActivo);

    return router;
  }
}
