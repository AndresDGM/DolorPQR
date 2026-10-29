/**
 * Configuración de variables de entorno de la aplicación para producción.
 */
export const environment = {
  production: true,
  baseUrlNode: 'http://localhost:3000',
  // Origen de datos por módulo: 'node' consume el backend, 'local' usa la simulación en memoria
  adapter: {
    auth: 'node' as const,
    users: 'node' as const,
    pqrs: 'local' as const,
    categories: 'local' as const,
  },
};
