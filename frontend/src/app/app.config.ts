import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePqrLocal } from './core/application/providers/pqr.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    // Inversión de dependencias de Infraestructura:
    // - providePqrLocal()  -> Simulación en memoria con Faker
    // - providePqrNode()   -> Backend API NodeJS (Express)
    providePqrLocal(),
  ],
};
