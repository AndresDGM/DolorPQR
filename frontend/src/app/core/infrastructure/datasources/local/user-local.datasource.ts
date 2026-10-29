import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { UserNotFoundError } from '../../../domain/errors';
import { User, UserRoleName } from '../../../domain/models/user.model';

/**
 * Datasource local en memoria para la entidad User.
 *
 * @architecture Clean Architecture
 * @layer Infrastructure
 */
@Injectable({
  providedIn: 'root',
})
export class UserLocalDatasource {
  private users: User[] = [
    {
      idUsuario: 1,
      idRol: 1,
      rol: 'Solicitante',
      nombre: 'Carlos Mario Restrepo',
      correo: 'carlos.restrepo@gmail.com',
      identificacion: '1116234901',
      activo: true,
    },
    {
      idUsuario: 2,
      idRol: 2,
      rol: 'Analista SIAU',
      nombre: 'Carolina Gómez Soto',
      correo: 'carolina.gomez@dolormed.com',
      identificacion: '1116456789',
      activo: true,
    },
    {
      idUsuario: 3,
      idRol: 3,
      rol: 'Responsable',
      nombre: 'Dr. Fernando Salazar (Urgencias)',
      correo: 'fernando.salazar@dolormed.com',
      identificacion: '94321678',
      activo: true,
    },
    {
      idUsuario: 4,
      idRol: 3,
      rol: 'Responsable',
      nombre: 'Dra. Patricia Ortiz (Facturación)',
      correo: 'patricia.ortiz@dolormed.com',
      identificacion: '66987123',
      activo: true,
    },
    {
      idUsuario: 5,
      idRol: 4,
      rol: 'Directivo',
      nombre: 'Dra. María Elena Valencia',
      correo: 'maria.valencia@dolormed.com',
      identificacion: '31456789',
      activo: true,
    },
  ];

  getAll(count?: number): Observable<User[]> {
    const list = count ? this.users.slice(0, count) : [...this.users];
    return of(list).pipe(delay(200));
  }

  getById(idUsuario: number): Observable<User> {
    const item = this.users.find((u) => u.idUsuario === idUsuario);
    if (!item) {
      return throwError(() => new UserNotFoundError(idUsuario));
    }
    return of({ ...item }).pipe(delay(200));
  }

  getByRol(rol: UserRoleName): Observable<User[]> {
    const filtered = this.users.filter((u) => u.rol === rol);
    return of(filtered).pipe(delay(200));
  }

  /**
   * Helper síncrono para generación de mocks cruzados.
   */
  getUsersSync(): User[] {
    return [...this.users];
  }

  /**
   * Agrega un usuario a la memoria local.
   */
  addUserSync(user: User): void {
    this.users.push(user);
  }
}
