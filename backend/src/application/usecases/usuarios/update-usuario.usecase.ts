import { UpdateUsuarioDto } from '../../../domain/dtos/update-usuario.dto.js';
import { CustomError } from '../../../domain/errors/custom.error.js';
import { RolRepository } from '../../../domain/repositories/rol.repository.js';
import { UsuarioRepository } from '../../../domain/repositories/usuario.repository.js';
import { toUsuarioPublico, UsuarioPublico } from '../../types/usuario-publico.type.js';

export class UpdateUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly rolRepository: RolRepository
  ) {}

  async execute(idUsuario: number, dto: UpdateUsuarioDto): Promise<UsuarioPublico> {
    const usuario = await this.usuarioRepository.getById(idUsuario);
    if (!usuario) {
      throw CustomError.notFound('Usuario no encontrado');
    }

    if (dto.correo && dto.correo !== usuario.correo) {
      const existingCorreo = await this.usuarioRepository.getByCorreo(dto.correo);
      if (existingCorreo && existingCorreo.idUsuario !== idUsuario) {
        throw CustomError.conflict('El correo ya se encuentra registrado por otro usuario');
      }
    }

    if (dto.identificacion && dto.identificacion !== usuario.identificacion) {
      const existingIdentificacion = await this.usuarioRepository.getByIdentificacion(dto.identificacion);
      if (existingIdentificacion && existingIdentificacion.idUsuario !== idUsuario) {
        throw CustomError.conflict('La identificacion ya se encuentra registrada por otro usuario');
      }
    }

    if (dto.idRol !== undefined) {
      const rol = await this.rolRepository.getById(dto.idRol);
      if (!rol) {
        throw CustomError.badRequest('El rol especificado no existe');
      }
    }

    const updatedUsuario = await this.usuarioRepository.update(idUsuario, dto);
    if (!updatedUsuario) {
      throw CustomError.notFound('Usuario no encontrado');
    }

    const rol = await this.rolRepository.getById(updatedUsuario.idRol);
    if (!rol) {
      throw CustomError.notFound('Rol del usuario no encontrado');
    }

    return toUsuarioPublico(updatedUsuario, rol.nombre);
  }
}
