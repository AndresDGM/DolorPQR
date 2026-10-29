import 'dotenv/config';
import env from 'env-var';

export const envs = {
  PORT: env.get('PORT').default('3000').asPortNumber(),
  DB_HOST: env.get('DB_HOST').default('localhost').asString(),
  DB_PORT: env.get('DB_PORT').default('5432').asPortNumber(),
  DB_USER: env.get('DB_USER').default('postgres').asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').default('postgres').asString(),
  DB_NAME: env.get('DB_NAME').default('mipqr').asString(),
  // Secreto obligatorio para firmar los JWT; no tiene valor por defecto
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  // Clave DES compartida con el cliente: exactamente 8 caracteres
  DES_KEY: env.get('DES_KEY').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('8h').asString(),
};
