import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PqrHistory } from '../../../domain/models/pqr-history.model';
import { PqrResponse } from '../../../domain/models/pqr-response.model';
import { CreatePqrPayload, Pqr, PqrStatusName } from '../../../domain/models/pqr.model';
import { PqrRepository } from '../../../domain/repositories/pqr.repository';
import { PqrDataService } from '../../services/pqr-data.service';

/**
 * Implementación concreta del repositorio de PQRs para backend Node.js.
 *
 * @remarks
 * Adapter de infraestructura que cumple el contrato {@link PqrRepository}
 * conectándose a los endpoints de la API Node.js mediante {@link PqrDataService}.
 *
 * @architecture Clean Architecture
 * @layer Infrastructure
 */
@Injectable()
export class PqrNodeRepositoryImpl extends PqrRepository {
  private dataService = inject(PqrDataService);

  getAll(limit?: number): Observable<Pqr[]> {
    return this.dataService.getAllPqrsNode(limit);
  }

  getById(idPqr: number): Observable<Pqr> {
    return this.dataService.getPqrByIdNode(idPqr);
  }

  getByCodigoSeguimiento(codigoSeguimiento: string): Observable<Pqr> {
    return this.dataService.getPqrByCodigoNode(codigoSeguimiento);
  }

  create(payload: CreatePqrPayload): Observable<Pqr> {
    return this.dataService.createPqrNode(payload);
  }

  updateEstado(idPqr: number, nuevoEstado: PqrStatusName, observacion?: string): Observable<Pqr> {
    return this.dataService.updateEstadoNode(idPqr, nuevoEstado, observacion);
  }

  assignResponsable(idPqr: number, idResponsable: number): Observable<Pqr> {
    return this.dataService.assignResponsableNode(idPqr, idResponsable);
  }

  getHistorial(idPqr: number): Observable<PqrHistory[]> {
    return this.dataService.getHistorialNode(idPqr);
  }

  responder(idPqr: number, contenido: string): Observable<PqrResponse> {
    return this.dataService.responderNode(idPqr, contenido);
  }
}

