export const schemaSql = `
CREATE TABLE IF NOT EXISTS rol (
  id_rol      INTEGER PRIMARY KEY,
  nombre      VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario     SERIAL PRIMARY KEY,
  id_rol         INTEGER NOT NULL REFERENCES rol (id_rol),
  nombre         VARCHAR(120) NOT NULL,
  correo         VARCHAR(160) NOT NULL UNIQUE,
  identificacion VARCHAR(20) NOT NULL UNIQUE,
  -- Valor cifrado con RSA (formato "rsa1:<base64>"); nunca texto plano
  password       TEXT NOT NULL,
  activo         BOOLEAN NOT NULL DEFAULT TRUE
);

-- Bases creadas antes del cifrado tenian la contrasena como VARCHAR(255)
ALTER TABLE usuario ALTER COLUMN password TYPE TEXT;

CREATE INDEX IF NOT EXISTS idx_usuario_id_rol ON usuario (id_rol);
`;

export const seedSql = `
INSERT INTO rol (id_rol, nombre, descripcion) VALUES
  (1, 'Solicitante', 'Paciente o usuario externo que radica y consulta sus PQR.'),
  (2, 'Analista SIAU', 'Funcionario de atencion al usuario que clasifica y asigna.'),
  (3, 'Responsable', 'Profesional o jefe de area que gestiona y responde el caso.'),
  (4, 'Directivo', 'Coordinacion y direccion, con acceso de consulta.')
ON CONFLICT (id_rol) DO NOTHING;
`;
