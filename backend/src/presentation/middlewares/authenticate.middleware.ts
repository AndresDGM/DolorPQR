import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../../domain/errors/custom.error.js';
import { AuthenticateUseCase } from '../../application/usecases/auth/authenticate.usecase.js';

const PREFIJO_BEARER = 'Bearer ';

/** Verifica el header Authorization y adjunta el usuario recargado a req.user */
export function authenticate(authenticateUseCase: AuthenticateUseCase): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith(PREFIJO_BEARER)) {
        throw CustomError.unauthorized('Token no proporcionado');
      }

      const token = header.slice(PREFIJO_BEARER.length);
      const usuario = await authenticateUseCase.execute(token);

      req.user = { idUsuario: usuario.idUsuario, idRol: usuario.idRol, rol: usuario.rol };
      next();
    } catch (error) {
      next(error);
    }
  };
}
