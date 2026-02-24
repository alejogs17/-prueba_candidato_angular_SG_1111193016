import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // ANIMACIONES: requerido por PrimeNG para modales, dropdowns, etc.
import { provideHttpClient } from '@angular/common/http'; // Forma moderna (reemplaza HttpClientModule)

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),          // Proveedor moderno del HttpClient
    provideAnimationsAsync(),     // CRÍTICO: habilita animaciones para que PrimeNG funcione
  ]
};
