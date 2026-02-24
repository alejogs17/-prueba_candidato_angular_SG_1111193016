import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StateEntidad } from '../interfaces/state-entidad';
import { Entidad } from '../interfaces/entidad';
import { environment } from '../../../environments/environment'; // Importamos la variable de entorno

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http = inject(HttpClient);

  // La URL ahora viene del environment, no hardcodeada
  private url: string = `${environment.apiUrl}entidades`;

  // Estado interno del servicio usando Signals de Angular 17
  // Un Signal es un contenedor reactivo: cuando cambia, Angular actualiza la vista automáticamente
  #state = signal<StateEntidad>({
    loading: true,
    entidades: []
  });

  // Señales computadas (solo lectura) que exponen partes del estado
  entidades = computed(() => this.#state().entidades);
  loading = computed(() => this.#state().loading);

  constructor() {
    // Al crear el servicio, cargamos las entidades inmediatamente
    this.refresh();
  }

  /** 🔄 Carga (o recarga) la lista de entidades desde el API */
  refresh(): void {
    this.#state.update(state => ({ ...state, loading: true }));
    this.http.get<Entidad[]>(this.url).subscribe({
      next: (res) => {
        this.#state.set({ loading: false, entidades: res });
      },
      error: (error) => {
        // CORRECCIÓN: Si hay error, también ponemos loading en false para no quedarnos bloqueados
        this.#state.set({ loading: false, entidades: [] });
        console.error('Error al cargar entidades:', error);
      }
    });
  }

  /** ➕ Crea una nueva entidad en el API */
  create(entidad: Partial<Entidad>): Observable<Entidad> {
    return this.http.post<Entidad>(this.url, entidad).pipe(
      tap(() => this.refresh())
    );
  }
  /** Actualiza una entidad existente en el API */
  update(entidad: Entidad): Observable<Entidad> {
    return this.http.put<Entidad>(`${this.url}/${entidad.id}`, entidad).pipe(
      tap(() => this.refresh())
    );
  }

  /** Elimina una sola entidad por su objeto completo */
  delete(entidad: Entidad): Observable<Entidad> {
    return this.http.delete<Entidad>(`${this.url}/${entidad.id}`).pipe(
      tap(() => this.refresh())
    );
  }

  /** Elimina múltiples entidades en paralelo */
  deleteMultiple(entidades: Entidad[]): void {
    // Promise.all ejecuta todas las peticiones al mismo tiempo
    const peticiones = entidades.map(e =>
      this.http.delete<Entidad>(`${this.url}/${e.id}`).toPromise()
    );
    Promise.all(peticiones)
      .then(() => this.refresh())
      .catch(error => console.error('Error al eliminar múltiples entidades:', error));
  }
}
