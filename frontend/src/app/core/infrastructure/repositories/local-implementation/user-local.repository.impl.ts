import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserRoleName } from '../../../domain/models/user.model';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { PqrDataService } from '../../services/pqr-data.service';

/**
 * Implementación local del repositorio de usuarios con Faker.
 *
 * @architecture Clean Architecture
 * @layer Infrastructure
 */
@Injectable()
export class UserLocalRepositoryImpl extends UserRepository {
  private dataService = inject(PqrDataService);

  getAll(countUsers?: number): Observable<User[]> {
    return this.dataService.getAllUsersLocal(countUsers);
  }

  getById(idUsuario: number): Observable<User> {
    return this.dataService.getUserByIdLocal(idUsuario);
  }

  getByRol(rol: UserRoleName): Observable<User[]> {
    return this.dataService.getUsersByRolLocal(rol);
  }
}

