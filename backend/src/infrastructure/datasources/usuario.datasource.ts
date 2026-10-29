import { CreateUsuarioDto } from '../../domain/dtos/create-usuario.dto.js';
import { UpdateUsuarioDto } from '../../domain/dtos/update-usuario.dto.js';
import { Usuario } from '../../domain/entities/usuario.entity.js';

export class UsuarioDatasource {
  private idCounter = 7;
  private readonly usuarios: Usuario[] = [
    new Usuario(1, 2, 'Carolina Gomez', 'carolina.gomez@dolormed.com', '1010101001', '1234', true),
    new Usuario(2, 3, 'Fernando Salazar', 'fernando.salazar@dolormed.com', '1010101002', '1234', true),
    new Usuario(3, 3, 'Laura Ortiz', 'laura.ortiz@dolormed.com', '1010101003', '1234', true),
    new Usuario(4, 4, 'Maria Valencia', 'maria.valencia@dolormed.com', '1010101004', '1234', true),
    new Usuario(5, 1, 'Carlos Restrepo', 'carlos.restrepo@gmail.com', '1010101005', '1234', true),
    new Usuario(6, 1, 'Ana Torres', 'ana.torres@gmail.com', '1010101006', '1234', false),
  ];

  private clone(u: Usuario): Usuario {
    return new Usuario(
      u.idUsuario,
      u.idRol,
      u.nombre,
      u.correo,
      u.identificacion,
      u.password,
      u.activo
    );
  }

  async getAll(count?: number): Promise<Usuario[]> {
    const list = typeof count === 'number' && count > 0
      ? this.usuarios.slice(0, count)
      : this.usuarios;
    return list.map((u) => this.clone(u));
  }

  async getById(idUsuario: number): Promise<Usuario | null> {
    const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
    if (!usuario) return null;
    return this.clone(usuario);
  }

  async getByCorreo(correo: string): Promise<Usuario | null> {
    const normalized = correo.trim().toLowerCase();
    const usuario = this.usuarios.find((u) => u.correo.toLowerCase() === normalized);
    if (!usuario) return null;
    return this.clone(usuario);
  }

  async getByIdentificacion(identificacion: string): Promise<Usuario | null> {
    const normalized = identificacion.trim();
    const usuario = this.usuarios.find((u) => u.identificacion === normalized);
    if (!usuario) return null;
    return this.clone(usuario);
  }

  async getByRol(idRol: number): Promise<Usuario[]> {
    return this.usuarios
      .filter((u) => u.idRol === idRol)
      .map((u) => this.clone(u));
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const nuevoUsuario = new Usuario(
      this.idCounter++,
      dto.idRol,
      dto.nombre,
      dto.correo,
      dto.identificacion,
      dto.password,
      true
    );
    this.usuarios.push(nuevoUsuario);
    return this.clone(nuevoUsuario);
  }

  async update(idUsuario: number, dto: UpdateUsuarioDto): Promise<Usuario | null> {
    const index = this.usuarios.findIndex((u) => u.idUsuario === idUsuario);
    if (index === -1) return null;

    const current = this.usuarios[index];
    const updated = new Usuario(
      current.idUsuario,
      dto.idRol !== undefined ? dto.idRol : current.idRol,
      dto.nombre !== undefined ? dto.nombre : current.nombre,
      dto.correo !== undefined ? dto.correo : current.correo,
      dto.identificacion !== undefined ? dto.identificacion : current.identificacion,
      current.password,
      current.activo
    );

    this.usuarios[index] = updated;
    return this.clone(updated);
  }

  async setActivo(idUsuario: number, activo: boolean): Promise<Usuario | null> {
    const index = this.usuarios.findIndex((u) => u.idUsuario === idUsuario);
    if (index === -1) return null;

    const current = this.usuarios[index];
    const updated = new Usuario(
      current.idUsuario,
      current.idRol,
      current.nombre,
      current.correo,
      current.identificacion,
      current.password,
      activo
    );

    this.usuarios[index] = updated;
    return this.clone(updated);
  }
}
