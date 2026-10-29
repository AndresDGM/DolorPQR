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
  -- TODO: reemplazar por password_hash cuando se agregue encriptacion
  password       VARCHAR(255) NOT NULL,
  activo         BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_usuario_id_rol ON usuario (id_rol);
`;

export const seedSql = `
INSERT INTO rol (id_rol, nombre, descripcion) VALUES
  (1, 'Solicitante', 'Paciente o usuario externo que radica y consulta sus PQR.'),
  (2, 'Analista SIAU', 'Funcionario de atencion al usuario que clasifica y asigna.'),
  (3, 'Responsable', 'Profesional o jefe de area que gestiona y responde el caso.'),
  (4, 'Directivo', 'Coordinacion y direccion, con acceso de consulta.')
ON CONFLICT (id_rol) DO NOTHING;

INSERT INTO usuario (id_usuario, id_rol, nombre, correo, identificacion, password, activo) VALUES
  (1, 2, 'Carolina Gomez', 'carolina.gomez@dolormed.com', '1010101001', '1234', TRUE),
  (2, 3, 'Fernando Salazar', 'fernando.salazar@dolormed.com', '1010101002', '1234', TRUE),
  (3, 3, 'Laura Ortiz', 'laura.ortiz@dolormed.com', '1010101003', '1234', TRUE),
  (4, 4, 'Maria Valencia', 'maria.valencia@dolormed.com', '1010101004', '1234', TRUE),
  (5, 1, 'Carlos Restrepo', 'carlos.restrepo@gmail.com', '1010101005', '1234', TRUE),
  (6, 1, 'Ana Torres', 'ana.torres@gmail.com', '1010101006', '1234', FALSE)
ON CONFLICT (id_usuario) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('usuario', 'id_usuario'),
  GREATEST((SELECT COALESCE(MAX(id_usuario), 1) FROM usuario), 1)
);
`;
