import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { PqrRepository } from '../../domain/repositories/pqr.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import {
  CategoryLocalDatasource,
  PqrLocalDatasource,
  UserLocalDatasource,
} from '../../infrastructure/datasources/local';
import {
  CategoryRemoteDatasource,
  PqrRemoteDatasource,
  UserRemoteDatasource,
} from '../../infrastructure/datasources/remote';
import { CategoryLocalRepositoryImpl } from '../../infrastructure/repositories/local-implementation/category-local.repository.impl';
import { PqrLocalRepositoryImpl } from '../../infrastructure/repositories/local-implementation/pqr-local.repository.impl';
import { UserLocalRepositoryImpl } from '../../infrastructure/repositories/local-implementation/user-local.repository.impl';
import { CategoryNodeRepositoryImpl } from '../../infrastructure/repositories/node-implementation/category-node.repository.impl';
import { PqrNodeRepositoryImpl } from '../../infrastructure/repositories/node-implementation/pqr-node.repository.impl';
import { UserNodeRepositoryImpl } from '../../infrastructure/repositories/node-implementation/user-node.repository.impl';
import {
  AssignPqrResponsableUseCase,
  CreatePqrUseCase,
  GetAllCategoriesUseCase,
  GetAllPqrsUseCase,
  GetAllUsersUseCase,
  GetCategoryByIdUseCase,
  GetPqrByCodigoUseCase,
  GetPqrByIdUseCase,
  GetPqrHistorialUseCase,
  GetUserByIdUseCase,
  GetUsersByRolUseCase,
  ResponderPqrUseCase,
  UpdatePqrEstadoUseCase,
} from '../usecases';

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
 * Listado de casos de uso para las entidades User y Category.
 */
export const USER_CATEGORY_USE_CASES: Provider[] = [
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  GetUsersByRolUseCase,
  GetAllCategoriesUseCase,
  GetCategoryByIdUseCase,
];

/**
 * Casos de uso consolidados del dominio MiPQR.
 */
export const ALL_USE_CASES: Provider[] = [
  ...PQR_USE_CASES,
  ...USER_CATEGORY_USE_CASES,
];

/**
 * Datasources locales para simulación con Faker en memoria.
 */
export const LOCAL_DATASOURCES: Provider[] = [
  CategoryLocalDatasource,
  UserLocalDatasource,
  PqrLocalDatasource,
];

/**
 * Datasources remotos conectados al Backend Node.js.
 */
export const REMOTE_DATASOURCES: Provider[] = [
  CategoryRemoteDatasource,
  UserRemoteDatasource,
  PqrRemoteDatasource,
];

/**
 * Proveedores locales para simulación en memoria con Faker.
 */
export const PQR_LOCAL_PROVIDERS: Provider[] = [
  ...ALL_USE_CASES,
  ...LOCAL_DATASOURCES,
  { provide: PqrRepository, useClass: PqrLocalRepositoryImpl },
  { provide: UserRepository, useClass: UserLocalRepositoryImpl },
  { provide: CategoryRepository, useClass: CategoryLocalRepositoryImpl },
];

/**
 * Proveedores conectados al Backend Node.js.
 */
export const PQR_NODE_PROVIDERS: Provider[] = [
  ...ALL_USE_CASES,
  ...REMOTE_DATASOURCES,
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
