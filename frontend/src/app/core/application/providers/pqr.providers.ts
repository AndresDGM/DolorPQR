import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { PqrRepository } from '../../domain/repositories/pqr.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CategoryLocalRepositoryImpl } from '../../infrastructure/repositories/local-implementation/category-local.repository.impl';
import { PqrLocalRepositoryImpl } from '../../infrastructure/repositories/local-implementation/pqr-local.repository.impl';
import { UserLocalRepositoryImpl } from '../../infrastructure/repositories/local-implementation/user-local.repository.impl';
import { CategoryNodeRepositoryImpl } from '../../infrastructure/repositories/node-implementation/category-node.repository.impl';
import { PqrNodeRepositoryImpl } from '../../infrastructure/repositories/node-implementation/pqr-node.repository.impl';
import { UserNodeRepositoryImpl } from '../../infrastructure/repositories/node-implementation/user-node.repository.impl';
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
 * Proveedores locales para simulación en memoria con Faker.
 */
export const PQR_LOCAL_PROVIDERS: Provider[] = [
  ...PQR_USE_CASES,
  { provide: PqrRepository, useClass: PqrLocalRepositoryImpl },
  { provide: UserRepository, useClass: UserLocalRepositoryImpl },
  { provide: CategoryRepository, useClass: CategoryLocalRepositoryImpl },
];

/**
 * Proveedores conectados al Backend Node.js.
 */
export const PQR_NODE_PROVIDERS: Provider[] = [
  ...PQR_USE_CASES,
  { provide: PqrRepository, useClass: PqrNodeRepositoryImpl },
  { provide: UserRepository, useClass: UserNodeRepositoryImpl },
  { provide: CategoryRepository, useClass: CategoryNodeRepositoryImpl },
];

/**
 * Función proveedora para usar la implementación local con Faker.
 */
export function providePqrLocal(): EnvironmentProviders {
  return makeEnvironmentProviders(PQR_LOCAL_PROVIDERS);
}

/**
 * Función proveedora para usar la API del backend Node.js.
 */
export function providePqrNode(): EnvironmentProviders {
  return makeEnvironmentProviders(PQR_NODE_PROVIDERS);
}
