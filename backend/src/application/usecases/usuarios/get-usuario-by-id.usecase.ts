import { CustomError } from '../../../domain/errors/custom.error.js';
import { RolRepository } from '../../../domain/repositories/rol.repository.js';
import { UsuarioRepository } from '../../../domain/repositories/usuario.repository.js';
import { toUsuarioPublico, UsuarioPublico } from '../../types/usuario-publico.type.js';

export class GetUsuarioByIdUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly rolRepository: RolRepository
  ) {}

  async execute(idUsuario: number): Promise<UsuarioPublico> {
    const usuario = await this.usuarioRepository.getById(idUsuario);
    if (!usuario) {
      throw CustomError.notFound('Usuario no encontrado');
    }

    const rol = await this.rolRepository.getById(usuario.idRol);
    if (!rol) {
      throw CustomError.notFound('Rol del usuario no encontrado');
    }

    return toUsuarioPublico(usuario, rol.nombre);
  }
}
