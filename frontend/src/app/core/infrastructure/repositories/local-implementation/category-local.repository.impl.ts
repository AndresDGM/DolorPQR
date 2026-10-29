import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../domain/models/category.model';
import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { PqrDataService } from '../../services/pqr-data.service';

/**
 * Implementación local del repositorio de categorías.
 *
 * @architecture Clean Architecture
 * @layer Infrastructure
 */
@Injectable()
export class CategoryLocalRepositoryImpl extends CategoryRepository {
  private dataService = inject(PqrDataService);

  getAll(): Observable<Category[]> {
    return this.dataService.getAllCategoriesLocal();
  }

  getById(idCategoria: number): Observable<Category> {
    return this.dataService.getCategoryByIdLocal(idCategoria);
  }
}

