import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserRoleName } from '../../../domain/models/user.model';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { PqrDataService } from '../../services/pqr-data.service';

/**
 * Implementación del repositorio de usuarios para backend Node.js.
 *
 * @architecture Clean Architecture
 * @layer Infrastructure
 */
@Injectable()
export class UserNodeRepositoryImpl extends UserRepository {
  private dataService = inject(PqrDataService);

  getAll(countUsers?: number): Observable<User[]> {
    return this.dataService.getAllUsersNode(countUsers);
  }

  getById(idUsuario: number): Observable<User> {
    return this.dataService.getUserByIdNode(idUsuario);
  }

  getByRol(rol: UserRoleName): Observable<User[]> {
    return this.dataService.getUsersByRolNode(rol);
  }
}

