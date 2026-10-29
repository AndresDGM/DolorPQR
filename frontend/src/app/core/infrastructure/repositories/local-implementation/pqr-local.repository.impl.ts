import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../domain/models/category.model';
import { PqrHistory } from '../../../domain/models/pqr-history.model';
import { PqrResponse } from '../../../domain/models/pqr-response.model';
import { CreatePqrPayload, Pqr, PqrStatusName } from '../../../domain/models/pqr.model';
import { PqrRepository } from '../../../domain/repositories/pqr.repository';
import { PqrDataService } from '../../services/pqr-data.service';

/**
 * Implementación local del repositorio de PQRs.
 *
 * @remarks
 * Pertenece a la **capa de Infraestructura** y actúa como un **Adapter**
 * entre el contrato del dominio {@link PqrRepository} y el datasource local simulado
 * con Faker {@link PqrDataService}.
 *
 * @architecture Clean Architecture
 * @layer Infrastructure
 *
 * @see {@link PqrRepository}
 * @see {@link PqrDataService}
 */
@Injectable()
export class PqrLocalRepositoryImpl extends PqrRepository {
  private dataService = inject(PqrDataService);

  getAll(limit?: number): Observable<Pqr[]> {
    return this.dataService.getAllPqrsLocal(limit);
  }

  getById(idPqr: number): Observable<Pqr> {
    return this.dataService.getPqrByIdLocal(idPqr);
  }

  getByCodigoSeguimiento(codigoSeguimiento: string): Observable<Pqr> {
    return this.dataService.getPqrByCodigoLocal(codigoSeguimiento);
  }

  create(payload: CreatePqrPayload): Observable<Pqr> {
    return this.dataService.createPqrLocal(payload);
  }

  updateEstado(idPqr: number, nuevoEstado: PqrStatusName, observacion?: string): Observable<Pqr> {
    return this.dataService.updateEstadoLocal(idPqr, nuevoEstado, observacion);
  }

  assignResponsable(idPqr: number, idResponsable: number): Observable<Pqr> {
    return this.dataService.assignResponsableLocal(idPqr, idResponsable);
  }

  getHistorial(idPqr: number): Observable<PqrHistory[]> {
    return this.dataService.getHistorialLocal(idPqr);
  }

  responder(idPqr: number, contenido: string): Observable<PqrResponse> {
    return this.dataService.responderLocal(idPqr, contenido);
  }
}

