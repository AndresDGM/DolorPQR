import { NextFunction, Request, Response } from 'express';
import { LoginDto } from '../../domain/dtos/login.dto.js';
import { LoginUseCase } from '../../application/usecases/auth/login.usecase.js';

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [error, dto] = LoginDto.create(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }

      const usuario = await this.loginUseCase.execute(dto!);
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  };
}
