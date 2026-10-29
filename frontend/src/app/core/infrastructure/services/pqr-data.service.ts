import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { fakerES as faker } from '@faker-js/faker';
import { delay, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../domain/models/category.model';
import { PqrHistory } from '../../domain/models/pqr-history.model';
import { PqrResponse } from '../../domain/models/pqr-response.model';
import { CreatePqrPayload, Pqr, PqrStatusName, PqrType } from '../../domain/models/pqr.model';
import { User, UserRoleName } from '../../domain/models/user.model';
import {
  CategoryNotFoundError,
  PqrNotFoundError,
  UserNotFoundError,
} from '../../domain/errors';

/**
 * Servicio centralizado de Infraestructura para el acceso a datos.
 *
 * @description
 * Administra las comunicaciones HTTP hacia el backend NodeJS
 * así como la generación y persistencia en memoria de datos simulados mediante Faker.
 *
 * @architecture Clean Architecture
 * @layer Infrastructure
 */
@Injectable({
  providedIn: 'root',
})
export class PqrDataService {
  private httpClient = inject(HttpClient);

  private readonly nodeUrl = environment.baseUrlNode;

  // ==========================================
  // DATOS SIMULADOS EN MEMORIA (FAKER)
  // ==========================================
  private categories: Category[] = [
    { idCategoria: 1, nombre: 'Consulta Externa', descripcion: 'Atención médica general y con especialistas.', activa: true },
    { idCategoria: 2, nombre: 'Urgencias', descripcion: 'Atención de emergencias y triage médico.', activa: true },
    { idCategoria: 3, nombre: 'Farmacia y Medicamentos', descripcion: 'Dispensación y entrega de fórmulas médicas.', activa: true },
    { idCategoria: 4, nombre: 'Facturación y Copagos', descripcion: 'Liquidación de cuentas, cobros y autorizaciones EPS.', activa: true },
    { idCategoria: 5, nombre: 'Laboratorio e Imágenes', descripcion: 'Toma de muestras y entrega de resultados.', activa: true },
  ];

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

  private pqrs: Pqr[] = [];
  private history: PqrHistory[] = [];
  private responses: PqrResponse[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData(): void {
    const tipos: PqrType[] = ['Peticion', 'Queja', 'Reclamo', 'Sugerencia'];
    const estados: PqrStatusName[] = ['Recibida', 'En revision', 'Asignada', 'En gestion', 'Respondida', 'Cerrada'];

    const asuntosPorTipo: Record<PqrType, string[]> = {
      Peticion: [
        'Solicitud de copia de historia clínica completa',
        'Expedición de certificado de atención médica',
        'Reasignación de cita con especialista en ortopedia',
        'Aclaración sobre fórmula médica prescrita',
      ],
      Queja: [
        'Demora excesiva en sala de espera de urgencias',
        'Inconformidad por trato recibido en recepción',
        'Tiempo prolongado para asignación de cita médica',
        'Dificultad de comunicación vía telefónica con SIAU',
      ],
      Reclamo: [
        'Cobro indebido de copago en cita autorizada',
        'Falta de entrega de medicamento pendiente en farmacia',
        'Pérdida de orden médica en módulo de admisiones',
        'Error en el valor facturado por procedimiento menor',
      ],
      Sugerencia: [
        'Implementar recordatorios de cita por WhatsApp',
        'Habilitar dispensador de turnos digital en sala',
        'Extender el horario de atención en farmacia',
        'Mejorar la señalización en el área de rayos X',
      ],
    };

    for (let i = 1; i <= 12; i++) {
      const tipo = faker.helpers.arrayElement(tipos);
      const estado = faker.helpers.arrayElement(estados);
      const categoria = faker.helpers.arrayElement(this.categories);
      const solicitanteNombre = faker.person.fullName();
      const solicitanteEmail = faker.internet.email();
      const codigo = `PQR-2026-${String(100 + i).padStart(4, '0')}`;
      const asunto = faker.helpers.arrayElement(asuntosPorTipo[tipo]);
      const fechaRegistro = faker.date.recent({ days: 15 }).toISOString();

      const pqr: Pqr = {
        idPqr: i,
        codigoSeguimiento: codigo,
        idSolicitante: 10 + i,
        nombreSolicitante: solicitanteNombre,
        correoSolicitante: solicitanteEmail,
        idCategoria: categoria.idCategoria,
        categoria: categoria.nombre,
        idEstado: estados.indexOf(estado) + 1,
        estado: estado,
        idResponsable: estado !== 'Recibida' && estado !== 'En revision' ? 3 : undefined,
        nombreResponsable: estado !== 'Recibida' && estado !== 'En revision' ? 'Dr. Fernando Salazar' : undefined,
        tipoPqr: tipo,
        asunto: asunto,
        descripcion: `${asunto}. Solicitado por ${solicitanteNombre}. Se requiere atención oportuna.`,
        fechaRegistro: fechaRegistro,
        fechaCierre: estado === 'Cerrada' ? new Date().toISOString() : undefined,
      };

      this.pqrs.push(pqr);

      this.history.push({
        idHistorial: this.history.length + 1,
        idPqr: i,
        idUsuario: 1,
        nombreUsuario: solicitanteNombre,
        idEstado: 1,
        estado: 'Recibida',
        accion: 'Radicación inicial',
        observacion: 'Solicitud radicada con éxito en la plataforma MiPQR.',
        fecha: fechaRegistro,
      });

      if (estado !== 'Recibida') {
        this.history.push({
          idHistorial: this.history.length + 1,
          idPqr: i,
          idUsuario: 2,
          nombreUsuario: 'Carolina Gómez (SIAU)',
          idEstado: pqr.idEstado,
          estado: estado,
          accion: 'Actualización de estado',
          observacion: `El estado del caso avanzó a: ${estado}.`,
          fecha: new Date().toISOString(),
        });
      }

      if (estado === 'Respondida' || estado === 'Cerrada') {
        this.responses.push({
          idRespuesta: this.responses.length + 1,
          idPqr: i,
          idUsuario: 3,
          nombreUsuario: 'Dr. Fernando Salazar',
          contenido: `Estimado(a) ${solicitanteNombre}: Dando respuesta a su solicitud, le informamos que las acciones correctivas fueron implementadas.`,
          fechaRespuesta: new Date().toISOString(),
        });
      }
    }
  }

  // ==========================================
  // 1. IMPLEMENTACIÓN LOCAL (FAKER)
  // ==========================================

  getAllPqrsLocal(limit?: number): Observable<Pqr[]> {
    const result = limit ? this.pqrs.slice(0, limit) : [...this.pqrs];
    return of(result).pipe(delay(350));
  }

  getPqrByIdLocal(idPqr: number): Observable<Pqr> {
    const item = this.pqrs.find((p) => p.idPqr === idPqr);
    if (!item) {
      return throwError(() => new PqrNotFoundError(idPqr));
    }
    return of({ ...item }).pipe(delay(250));
  }

  getPqrByCodigoLocal(codigo: string): Observable<Pqr> {
    const clean = codigo.trim().toUpperCase();
    const item = this.pqrs.find((p) => p.codigoSeguimiento.toUpperCase() === clean);
    if (!item) {
      return throwError(() => new PqrNotFoundError(codigo));
    }
    return of({ ...item }).pipe(delay(300));
  }

  createPqrLocal(payload: CreatePqrPayload): Observable<Pqr> {
    const newId = this.pqrs.length + 1;
    const codigo = `PQR-2026-${String(newId).padStart(4, '0')}`;
    const categoria = this.categories.find((c) => c.idCategoria === payload.idCategoria);
    const fecha = new Date().toISOString();

    const nueva: Pqr = {
      idPqr: newId,
      codigoSeguimiento: codigo,
      idSolicitante: faker.number.int({ min: 100, max: 999 }),
      nombreSolicitante: payload.nombreSolicitante,
      correoSolicitante: payload.correoSolicitante,
      idCategoria: payload.idCategoria,
      categoria: categoria?.nombre ?? 'General',
      idEstado: 1,
      estado: 'Recibida',
      tipoPqr: payload.tipoPqr,
      asunto: payload.asunto,
      descripcion: payload.descripcion,
      fechaRegistro: fecha,
    };

    this.pqrs.unshift(nueva);

    this.history.push({
      idHistorial: this.history.length + 1,
      idPqr: newId,
      idUsuario: 1,
      nombreUsuario: payload.nombreSolicitante,
      idEstado: 1,
      estado: 'Recibida',
      accion: 'Radicación inicial',
      observacion: 'Solicitud radicada en plataforma con código de seguimiento.',
      fecha,
    });

    return of(nueva).pipe(delay(400));
  }

  updateEstadoLocal(idPqr: number, nuevoEstado: PqrStatusName, observacion?: string): Observable<Pqr> {
    const index = this.pqrs.findIndex((p) => p.idPqr === idPqr);
    if (index === -1) {
      return throwError(() => new PqrNotFoundError(idPqr));
    }

    const current = this.pqrs[index]!;
    const updated: Pqr = {
      ...current,
      estado: nuevoEstado,
      fechaCierre: nuevoEstado === 'Cerrada' ? new Date().toISOString() : current.fechaCierre,
    };
    this.pqrs[index] = updated;

    this.history.push({
      idHistorial: this.history.length + 1,
      idPqr,
      idUsuario: 2,
      nombreUsuario: 'Analista SIAU',
      idEstado: 2,
      estado: nuevoEstado,
      accion: `Cambio a estado ${nuevoEstado}`,
      observacion: observacion || `Transición a ${nuevoEstado}`,
      fecha: new Date().toISOString(),
    });

    return of(updated).pipe(delay(300));
  }

  assignResponsableLocal(idPqr: number, idResponsable: number): Observable<Pqr> {
    const index = this.pqrs.findIndex((p) => p.idPqr === idPqr);
    if (index === -1) {
      return throwError(() => new PqrNotFoundError(idPqr));
    }

    const responsable = this.users.find((u) => u.idUsuario === idResponsable);
    const updated: Pqr = {
      ...this.pqrs[index]!,
      idResponsable,
      nombreResponsable: responsable?.nombre ?? 'Responsable Asignado',
      estado: 'Asignada',
    };
    this.pqrs[index] = updated;

    this.history.push({
      idHistorial: this.history.length + 1,
      idPqr,
      idUsuario: 2,
      nombreUsuario: 'Analista SIAU',
      idEstado: 3,
      estado: 'Asignada',
      accion: 'Asignación de responsable',
      observacion: `Caso asignado a: ${updated.nombreResponsable}`,
      fecha: new Date().toISOString(),
    });

    return of(updated).pipe(delay(300));
  }

  getHistorialLocal(idPqr: number): Observable<PqrHistory[]> {
    const events = this.history.filter((h) => h.idPqr === idPqr);
    return of([...events]).pipe(delay(250));
  }

  responderLocal(idPqr: number, contenido: string): Observable<PqrResponse> {
    const response: PqrResponse = {
      idRespuesta: this.responses.length + 1,
      idPqr,
      idUsuario: 3,
      nombreUsuario: 'Dr. Fernando Salazar',
      contenido,
      fechaRespuesta: new Date().toISOString(),
    };
    this.responses.push(response);

    this.updateEstadoLocal(idPqr, 'Respondida', 'Se emitió respuesta formal al caso.');
    return of(response).pipe(delay(350));
  }

  getAllUsersLocal(count?: number): Observable<User[]> {
    const list = count ? this.users.slice(0, count) : [...this.users];
    return of(list).pipe(delay(200));
  }

  getUserByIdLocal(idUsuario: number): Observable<User> {
    const item = this.users.find((u) => u.idUsuario === idUsuario);
    if (!item) {
      return throwError(() => new UserNotFoundError(idUsuario));
    }
    return of({ ...item }).pipe(delay(200));
  }

  getUsersByRolLocal(rol: UserRoleName): Observable<User[]> {
    const filtered = this.users.filter((u) => u.rol === rol);
    return of(filtered).pipe(delay(200));
  }

  getAllCategoriesLocal(): Observable<Category[]> {
    return of([...this.categories]).pipe(delay(150));
  }

  getCategoryByIdLocal(idCategoria: number): Observable<Category> {
    const item = this.categories.find((c) => c.idCategoria === idCategoria);
    if (!item) {
      return throwError(() => new CategoryNotFoundError(idCategoria));
    }
    return of({ ...item }).pipe(delay(150));
  }

  // ==========================================
  // 2. IMPLEMENTACIÓN NODE.JS BACKEND
  // ==========================================

  getAllPqrsNode(limit?: number): Observable<Pqr[]> {
    const url = limit ? `${this.nodeUrl}/api/pqrs?limit=${limit}` : `${this.nodeUrl}/api/pqrs`;
    return this.httpClient.get<Pqr[]>(url);
  }

  getPqrByIdNode(idPqr: number): Observable<Pqr> {
    return this.httpClient.get<Pqr>(`${this.nodeUrl}/api/pqrs/${idPqr}`);
  }

  getPqrByCodigoNode(codigo: string): Observable<Pqr> {
    return this.httpClient.get<Pqr>(`${this.nodeUrl}/api/pqrs/codigo/${codigo}`);
  }

  createPqrNode(payload: CreatePqrPayload): Observable<Pqr> {
    return this.httpClient.post<Pqr>(`${this.nodeUrl}/api/pqrs`, payload);
  }

  updateEstadoNode(idPqr: number, nuevoEstado: PqrStatusName, observacion?: string): Observable<Pqr> {
    return this.httpClient.patch<Pqr>(`${this.nodeUrl}/api/pqrs/${idPqr}/estado`, {
      estado: nuevoEstado,
      observacion,
    });
  }

  assignResponsableNode(idPqr: number, idResponsable: number): Observable<Pqr> {
    return this.httpClient.patch<Pqr>(`${this.nodeUrl}/api/pqrs/${idPqr}/responsable`, {
      idResponsable,
    });
  }

  getHistorialNode(idPqr: number): Observable<PqrHistory[]> {
    return this.httpClient.get<PqrHistory[]>(`${this.nodeUrl}/api/pqrs/${idPqr}/historial`);
  }

  responderNode(idPqr: number, contenido: string): Observable<PqrResponse> {
    return this.httpClient.post<PqrResponse>(`${this.nodeUrl}/api/pqrs/${idPqr}/respuestas`, {
      contenido,
    });
  }

  getAllUsersNode(countUsers?: number): Observable<User[]> {
    const url = countUsers ? `${this.nodeUrl}/api/users?count=${countUsers}` : `${this.nodeUrl}/api/users`;
    return this.httpClient.get<User[]>(url);
  }

  getUserByIdNode(idUsuario: number): Observable<User> {
    return this.httpClient.get<User>(`${this.nodeUrl}/api/users/${idUsuario}`);
  }

  getUsersByRolNode(rol: UserRoleName): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.nodeUrl}/api/users/rol/${rol}`);
  }

  getAllCategoriesNode(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.nodeUrl}/api/categories`);
  }

  getCategoryByIdNode(idCategoria: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.nodeUrl}/api/categories/${idCategoria}`);
  }
}
