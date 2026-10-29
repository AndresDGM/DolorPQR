import { Pool } from 'pg';
import { envs } from '../../config/envs.js';
import { schemaSql, seedSql } from './schema.js';

export const pool = new Pool({
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  user: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
});

/**
 * Crea las tablas si no existen y carga los datos iniciales.
 * Es idempotente: puede ejecutarse en cada arranque sin duplicar informacion.
 */
export async function initDatabase(): Promise<void> {
  await pool.query(schemaSql);
  await pool.query(seedSql);
}
