import { authController, rolesController, usuariosController } from './config/dependencies.js';
import { envs } from './config/envs.js';
import { AppRoutes } from './presentation/routes/index.js';
import { Server } from './presentation/server.js';

const routes = AppRoutes.routes({
  authController,
  rolesController,
  usuariosController,
});

const server = new Server({
  port: envs.PORT,
  routes,
});

server.start();
