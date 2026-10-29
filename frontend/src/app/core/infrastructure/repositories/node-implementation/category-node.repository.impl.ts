import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../domain/models/category.model';
import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { PqrDataService } from '../../services/pqr-data.service';

/**
 * Implementación del repositorio de categorías para backend Node.js.
 *
 * @architecture Clean Architecture
 * @layer Infrastructure
 */
@Injectable()
export class CategoryNodeRepositoryImpl extends CategoryRepository {
  private dataService = inject(PqrDataService);

  getAll(): Observable<Category[]> {
    return this.dataService.getAllCategoriesNode();
  }

  getById(idCategoria: number): Observable<Category> {
    return this.dataService.getCategoryByIdNode(idCategoria);
  }
}

