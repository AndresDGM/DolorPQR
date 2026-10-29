import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { PqrRepository } from '../../domain/repositories/pqr.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CategoryLocalRepositoryImpl } from '../../infrastructure/repositories/local-implementation/category-local.repository.impl';
import { PqrLocalRepositoryImpl } from '../../infrastructure/repositories/local-implementation/pqr-local.repository.impl';
import { UserLocalRepositoryImpl } from '../../infrastructure/repositories/local-implementation/user-local.repository.impl';
import { AssignPqrResponsableUseCase } from '../usecases/assign-pqr-responsable.usecase';
import { CreatePqrUseCase } from '../usecases/create-pqr.usecase';
import { GetAllPqrsUseCase } from '../usecases/get-all-pqrs.usecase';
import { GetPqrByCodigoUseCase } from '../usecases/get-pqr-by-codigo.usecase';
import { GetPqrByIdUseCase } from '../usecases/get-pqr-by-id.usecase';
import { GetPqrHistorialUseCase } from '../usecases/get-pqr-historial.usecase';
import { ResponderPqrUseCase } from '../usecases/responder-pqr.usecase';
import { UpdatePqrEstadoUseCase } from '../usecases/update-pqr-estado.usecase';

/**
 * Listado de casos de uso del dominio PQR.
 */
export const PQR_USE_CASES: Provider[] = [
  GetAllPqrsUseCase,
  GetPqrByIdUseCase,
  GetPqrByCodigoUseCase,
  CreatePqrUseCase,
  UpdatePqrEstadoUseCase,
  AssignPqrResponsableUseCase,
  ResponderPqrUseCase,
  GetPqrHistorialUseCase,
];

/**
 * Proveedores locales para simulación con Faker.
 *
 * @remarks
 * Asocia los contratos de repositorio del dominio a sus implementaciones locales
 * simuladas con Faker en memoria.
 */
export const PQR_LOCAL_PROVIDERS: Provider[] = [
  ...PQR_USE_CASES,
  { provide: PqrRepository, useClass: PqrLocalRepositoryImpl },
  { provide: UserRepository, useClass: UserLocalRepositoryImpl },
  { provide: CategoryRepository, useClass: CategoryLocalRepositoryImpl },
];

/**
 * Función proveedora para registrar la implementación local de PQR en el arranque de la app.
 *
 * @example
 * ```ts
 * // En app.config.ts:
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(routes),
 *     providePqrLocal(),
 *   ]
 * };
 * ```
 */
export function providePqrLocal(): EnvironmentProviders {
  return makeEnvironmentProviders(PQR_LOCAL_PROVIDERS);
}

