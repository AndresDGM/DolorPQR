import { LoginUseCase } from '../application/usecases/auth/login.usecase.js';
import { GetAllRolesUseCase } from '../application/usecases/roles/get-all-roles.usecase.js';
import { GetRolByIdUseCase } from '../application/usecases/roles/get-rol-by-id.usecase.js';
import { CreateUsuarioUseCase } from '../application/usecases/usuarios/create-usuario.usecase.js';
import { GetAllUsuariosUseCase } from '../application/usecases/usuarios/get-all-usuarios.usecase.js';
import { GetUsuarioByIdUseCase } from '../application/usecases/usuarios/get-usuario-by-id.usecase.js';
import { GetUsuariosByRolUseCase } from '../application/usecases/usuarios/get-usuarios-by-rol.usecase.js';
import { SetUsuarioActivoUseCase } from '../application/usecases/usuarios/set-usuario-activo.usecase.js';
import { UpdateUsuarioUseCase } from '../application/usecases/usuarios/update-usuario.usecase.js';
import { RolDatasource } from '../infrastructure/datasources/rol.datasource.js';
import { UsuarioDatasource } from '../infrastructure/datasources/usuario.datasource.js';
import { RolRepositoryImpl } from '../infrastructure/repositories/rol.repository.impl.js';
import { UsuarioRepositoryImpl } from '../infrastructure/repositories/usuario.repository.impl.js';
import { AuthController } from '../presentation/controllers/auth.controller.js';
import { RolesController } from '../presentation/controllers/roles.controller.js';
import { UsuariosController } from '../presentation/controllers/usuarios.controller.js';

// 1. Datasources
const rolDatasource = new RolDatasource();
const usuarioDatasource = new UsuarioDatasource();

// 2. Repositorios
const rolRepository = new RolRepositoryImpl(rolDatasource);
const usuarioRepository = new UsuarioRepositoryImpl(usuarioDatasource);

// 3. Casos de uso
const getAllRolesUseCase = new GetAllRolesUseCase(rolRepository);
const getRolByIdUseCase = new GetRolByIdUseCase(rolRepository);

const getAllUsuariosUseCase = new GetAllUsuariosUseCase(usuarioRepository, rolRepository);
const getUsuarioByIdUseCase = new GetUsuarioByIdUseCase(usuarioRepository, rolRepository);
const getUsuariosByRolUseCase = new GetUsuariosByRolUseCase(usuarioRepository, rolRepository);
const createUsuarioUseCase = new CreateUsuarioUseCase(usuarioRepository, rolRepository);
const updateUsuarioUseCase = new UpdateUsuarioUseCase(usuarioRepository, rolRepository);
const setUsuarioActivoUseCase = new SetUsuarioActivoUseCase(usuarioRepository, rolRepository);

const loginUseCase = new LoginUseCase(usuarioRepository, rolRepository);

// 4. Controladores
export const rolesController = new RolesController(
  getAllRolesUseCase,
  getRolByIdUseCase
);

export const usuariosController = new UsuariosController(
  getAllUsuariosUseCase,
  getUsuarioByIdUseCase,
  getUsuariosByRolUseCase,
  createUsuarioUseCase,
  updateUsuarioUseCase,
  setUsuarioActivoUseCase
);

export const authController = new AuthController(loginUseCase);
