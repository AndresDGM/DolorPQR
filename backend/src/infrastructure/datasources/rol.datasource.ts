import { Rol } from '../../domain/entities/rol.entity.js';

export class RolDatasource {
  private readonly roles: Rol[] = [
    new Rol(1, 'Solicitante', 'Paciente o usuario externo que radica y consulta sus PQR.'),
    new Rol(2, 'Analista SIAU', 'Funcionario de atencion al usuario que clasifica y asigna.'),
    new Rol(3, 'Responsable', 'Profesional o jefe de area que gestiona y responde el caso.'),
    new Rol(4, 'Directivo', 'Coordinacion y direccion, con acceso de consulta.'),
  ];

  async getAll(): Promise<Rol[]> {
    return this.roles.map((r) => new Rol(r.idRol, r.nombre, r.descripcion));
  }

  async getById(idRol: number): Promise<Rol | null> {
    const rol = this.roles.find((r) => r.idRol === idRol);
    if (!rol) return null;
    return new Rol(rol.idRol, rol.nombre, rol.descripcion);
  }

  async getByNombre(nombre: string): Promise<Rol | null> {
    const normalized = nombre.trim().toLowerCase();
    const rol = this.roles.find((r) => r.nombre.toLowerCase() === normalized);
    if (!rol) return null;
    return new Rol(rol.idRol, rol.nombre, rol.descripcion);
  }
}
