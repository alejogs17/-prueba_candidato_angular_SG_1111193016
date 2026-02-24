import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * AppComponent: Es el componente raíz de la aplicación.
 * Contiene el menú de navegación y el <router-outlet> donde se cargan
 * los componentes según la ruta activa.
 *
 * RouterLink: directiva para navegar entre rutas (reemplaza href)
 * RouterLinkActive: agrega una clase CSS cuando la ruta está activa
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Garantías Comunitarias';
}
