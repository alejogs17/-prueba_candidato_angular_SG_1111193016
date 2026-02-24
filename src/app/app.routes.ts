import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 * Usamos lazy loading (loadComponent) para cargar los componentes
 * solo cuando el usuario navega a esa ruta, mejorando el rendimiento inicial.
 * La ruta '' redirige automáticamente a /entidades.
 */
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'entidades',
        pathMatch: 'full'  // Redirige la raíz '/' a '/entidades'
    },
    {
        path: 'entidades',
        loadComponent: () => import('./entidades/entidades.component'),
        title: 'Entidades'  // Cambia el título del navegador
    },
    {
        path: 'contactos',
        loadComponent: () => import('./contactos/contactos.component'), // Nueva ruta de contactos
        title: 'Contactos'
    }
];
