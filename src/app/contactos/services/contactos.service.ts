import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StateContacto } from '../interfaces/state-contacto';
import { Contacto } from '../interfaces/contacto';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContactosService {
    private http = inject(HttpClient);
    private url: string = `${environment.apiUrl}contactos`; // URL desde environment

    // Estado reactivo con Signals (igual que EntidadesService)
    #state = signal<StateContacto>({
        loading: true,
        contactos: []
    });

    // Señales computadas de solo lectura
    contactos = computed(() => this.#state().contactos);
    loading = computed(() => this.#state().loading);

    constructor() {
        this.refresh();
    }

    /** 🔄 Carga la lista de contactos */
    refresh(): void {
        this.#state.update(state => ({ ...state, loading: true }));
        this.http.get<Contacto[]>(this.url).subscribe({
            next: (res) => {
                this.#state.set({ loading: false, contactos: res });
            },
            error: (error) => {
                this.#state.set({ loading: false, contactos: [] });
                console.error('Error al cargar contactos:', error);
            }
        });
    }

    /** ➕ Crea un nuevo contacto */
    create(contacto: Partial<Contacto>): Observable<Contacto> {
        return this.http.post<Contacto>(this.url, contacto).pipe(
            tap(() => this.refresh())
        );
    }
    /** Actualiza un contacto existente */
    update(contacto: Contacto): Observable<Contacto> {
        return this.http.put<Contacto>(`${this.url}/${contacto.id}`, contacto).pipe(
            tap(() => this.refresh())
        );
    }

    /** Elimina un contacto */
    delete(contacto: Contacto): Observable<Contacto> {
        return this.http.delete<Contacto>(`${this.url}/${contacto.id}`).pipe(
            tap(() => this.refresh())
        );
    }

    /** Elimina múltiples contactos */
    deleteMultiple(contactos: Contacto[]): void {
        const peticiones = contactos.map(c =>
            this.http.delete<Contacto>(`${this.url}/${c.id}`).toPromise()
        );
        Promise.all(peticiones)
            .then(() => this.refresh())
            .catch(error => console.error('Error al eliminar múltiples contactos:', error));
    }
}
