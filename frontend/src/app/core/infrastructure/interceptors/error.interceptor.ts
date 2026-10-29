import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP para captura y normalización de errores globales en respuestas HTTP.
 *
 * @description
 * Procesa respuestas de error comunes (400, 401, 403, 404, 500)
 * registrándolas o preparando la trazabilidad adecuada.
 *
 * @architecture Clean Architecture
 * @layer Infrastructure
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado en la comunicación con el servidor.';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error del cliente: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Solicitud inválida.';
            break;
          case 401:
            errorMessage = 'Sesión no autorizada o expirada.';
            break;
          case 403:
            errorMessage = 'No tiene permisos para ejecutar esta acción.';
            break;
          case 404:
            errorMessage = error.error?.message || 'Recurso no encontrado en el servidor.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Intente más tarde.';
            break;
          default:
            errorMessage = error.error?.message || `Error del servidor (${error.status})`;
        }
      }

      console.error(`[HTTP Error ${error.status}]:`, errorMessage, error);
      return throwError(() => error);
    })
  );
};
