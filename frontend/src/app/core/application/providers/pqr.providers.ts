import { Provider } from '@angular/core';
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
