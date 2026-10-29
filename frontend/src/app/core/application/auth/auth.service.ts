import { computed, inject, Injectable, signal } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { User, UserRoleName } from '../../domain/models/user.model';
import { UserLocalDatasource } from '../../infrastructure/datasources/local/user-local.datasource';

/**
 * Servicio de Aplicación para autenticación y estado de sesión de usuarios.
 *
 * @description
 * Administra el usuario activo en sesión mediante Signals reactivos.
 * En la fase MVP simula las credenciales contrastándolas contra el datasource
 * local de usuarios y almacena el estado en localStorage.
 *
 * @architecture Clean Architecture
 * @layer Application
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userLocalDs = inject(UserLocalDatasource);

  private readonly STORAGE_KEY = 'mipqr_current_user';
  private readonly TOKEN_KEY = 'auth_token';

  private _currentUser = signal<User | null>(this.getStoredUser());

  /** Usuario autenticado actualmente */
  readonly currentUser = this._currentUser.asReadonly();

  /** Indica si hay un usuario autenticado */
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  /** Rol del usuario en sesión */
  readonly userRol = computed<UserRoleName | null>(() => this._currentUser()?.rol ?? null);

  /**
   * Inicia sesión con correo electrónico y contraseña simulada.
   *
   * @param correo Correo electrónico del usuario
   * @param _password Contraseña (simulada)
   */
  login(correo: string, _password?: string): Observable<User> {
    const cleanEmail = correo.trim().toLowerCase();
    const users = this.userLocalDs.getUsersSync();
    const user = users.find((u) => u.correo.toLowerCase() === cleanEmail);

    if (!user) {
      return throwError(
        () => new Error('Credenciales inválidas. No se encontró ningún usuario con este correo.')
      );
    }

    if (!user.activo) {
      return throwError(
        () => new Error('La cuenta de usuario se encuentra inactiva. Contacte al área de soporte.')
      );
    }

    this.setCurrentUser(user);
    return of(user).pipe(delay(250));
  }

  /**
   * Registra una nueva cuenta de solicitante externo.
   *
   * @param payload Datos de registro del solicitante
   */
  registerSolicitante(payload: {
    nombre: string;
    correo: string;
    identificacion: string;
    password?: string;
  }): Observable<User> {
    const users = this.userLocalDs.getUsersSync();
    const cleanEmail = payload.correo.trim().toLowerCase();

    if (users.some((u) => u.correo.toLowerCase() === cleanEmail)) {
      return throwError(
        () => new Error('Ya existe una cuenta registrada con este correo electrónico.')
      );
    }

    const newUser: User = {
      idUsuario: users.length + 1,
      idRol: 1,
      rol: 'Solicitante',
      nombre: payload.nombre.trim(),
      correo: cleanEmail,
      identificacion: payload.identificacion.trim(),
      activo: true,
    };

    this.userLocalDs.addUserSync(newUser);
    this.setCurrentUser(newUser);

    return of(newUser).pipe(delay(300));
  }

  /**
   * Cierra la sesión activa y limpia las credenciales almacenadas.
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this._currentUser.set(null);
  }

  private setCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, `mock-jwt-token-${user.idUsuario}-${Date.now()}`);
    }
    this._currentUser.set(user);
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
