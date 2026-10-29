const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_ONLY_REGEX = /^\d{5,15}$/;

export class CreateUsuarioDto {
  private constructor(
    public readonly nombre: string,
    public readonly correo: string,
    public readonly identificacion: string,
    public readonly password: string,
    public readonly idRol: number
  ) {}

  static create(body: unknown): [string?, CreateUsuarioDto?] {
    if (!body || typeof body !== 'object') {
      return ['El cuerpo de la peticion debe ser un objeto', undefined];
    }

    const { nombre, correo, identificacion, password, idRol } = body as Record<string, unknown>;

    if (typeof nombre !== 'string' || nombre.trim().length < 3) {
      return ['El nombre es requerido y debe tener al menos 3 caracteres', undefined];
    }

    if (typeof correo !== 'string') {
      return ['El correo es requerido', undefined];
    }
    const normalizedCorreo = correo.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedCorreo)) {
      return ['El correo no tiene un formato valido', undefined];
    }

    if (typeof identificacion !== 'string' || !DIGITS_ONLY_REGEX.test(identificacion.trim())) {
      return ['La identificacion debe contener solo digitos y tener entre 5 y 15 caracteres', undefined];
    }

    if (typeof password !== 'string' || password.length < 4) {
      return ['La contrasena es requerida y debe tener al menos 4 caracteres', undefined];
    }

    if (typeof idRol !== 'number' || !Number.isInteger(idRol) || idRol < 1 || idRol > 4) {
      return ['El rol es invalido. Debe ser un numero entero entre 1 y 4', undefined];
    }

    return [
      undefined,
      new CreateUsuarioDto(
        nombre.trim(),
        normalizedCorreo,
        identificacion.trim(),
        password,
        idRol
      ),
    ];
  }
}
