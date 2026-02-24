import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';

// ReactiveFormsModule: necesario para usar FormGroup, FormControl y Validators
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Módulos de PrimeNG que usamos en el template
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';        // Para el modal
import { InputTextModule } from 'primeng/inputtext';   // Para los inputs del formulario
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Para confirmar eliminación
import { TooltipModule } from 'primeng/tooltip';       // Para los tooltips de los botones

import { EntidadesService } from './services/entidades.service';
import { Entidad } from './interfaces/entidad';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,  // Añadido para formularios reactivos
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    DialogModule,         // Añadido para el modal
    InputTextModule,      // Añadido para los campos de texto
    ConfirmDialogModule,  // Añadido para confirmaciones
    TooltipModule,        // Añadido para los tooltips
  ],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  // Proveemos MessageService y ConfirmationService aquí para que el componente los use
  providers: [MessageService, ConfirmationService]
})
export default class EntidadesComponent {
  public entidadesService = inject(EntidadesService);
  private messageService = inject(MessageService);           // Para mostrar notificaciones toast
  private confirmationService = inject(ConfirmationService); // Para el diálogo de confirmación
  private fb = inject(FormBuilder);                          // Para construir el formulario reactivo

  // Computed: cantidad de entidades (se recalcula automáticamente cuando cambia el signal)
  total = computed(() => this.entidadesService.entidades().length);

  // Array que almacena las entidades seleccionadas en la tabla
  selectedEntidades: Entidad[] = [];

  // Control del modal: visible o no
  mostrarModal: boolean = false;

  // Para saber si estamos editando (tiene id) o creando (null)
  entidadEnEdicion: Entidad | null = null;

  // FORMULARIO REACTIVO
  // FormBuilder.group() crea un formulario con campos y sus validaciones
  // Validators.required = campo obligatorio
  // Validators.minLength() = longitud mínima de texto
  entidadForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    nit: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]], // Validators.email valida el formato
  });

  // 
  // MÉTODOS
  // 

  /** Abre el modal en modo CREAR (formulario vacío) */
  openNew(): void {
    this.entidadEnEdicion = null;         // No hay entidad en edición
    this.entidadForm.reset();             // Limpiamos el formulario
    this.mostrarModal = true;             // Mostramos el modal
  }

  /** Abre el modal en modo EDITAR (rellena el formulario con los datos de la entidad) */
  edit(entidad: Entidad): void {
    this.entidadEnEdicion = entidad;
    // patchValue() llena el formulario con los valores del objeto entidad
    this.entidadForm.patchValue({
      nombre: entidad.nombre,
      nit: entidad.nit,
      telefono: entidad.telefono,
      direccion: entidad.direccion,
      email: entidad.email,
    });
    this.mostrarModal = true;
  }

  /** 💾 Guarda la entidad (crea o actualiza según corresponda) */
  guardar(): void {
    // Validamos que el formulario sea válido antes de enviar
    if (this.entidadForm.invalid) {
      // markAllAsTouched() hace que se muestren todos los mensajes de error
      this.entidadForm.markAllAsTouched();
      return;
    }

    const datos = this.entidadForm.value;

    if (this.entidadEnEdicion) {
      this.entidadesService.update({ ...this.entidadEnEdicion, ...datos }).subscribe({
        next: () => {
          this.mostrarToast('success', 'Actualizada', `Entidad "${datos.nombre}" actualizada correctamente`);
          this.mostrarModal = false;
          this.entidadForm.reset();
        },
        error: (err: HttpErrorResponse) => this.manejarErrorServidor(err)
      });
    } else {
      this.entidadesService.create(datos).subscribe({
        next: () => {
          this.mostrarToast('success', 'Creada', `Entidad "${datos.nombre}" creada correctamente`);
          this.mostrarModal = false;
          this.entidadForm.reset();
        },
        error: (err: HttpErrorResponse) => this.manejarErrorServidor(err)
      });
    }
  }

  /** Elimina múltiples entidades (las seleccionadas con el checkbox) */
  eliminarSeleccionadas(): void {
    if (this.selectedEntidades.length === 0) {
      this.mostrarToast('warn', 'Atención', 'Selecciona al menos una entidad para eliminar');
      return;
    }

    // ConfirmationService muestra un diálogo de confirmación antes de borrar
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar ${this.selectedEntidades.length} entidad(es)?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.entidadesService.deleteMultiple(this.selectedEntidades);
        this.mostrarToast('success', 'Eliminadas', `${this.selectedEntidades.length} entidad(es) eliminadas`);
        this.selectedEntidades = []; // Limpiamos la selección
      }
    });
  }

  /** Elimina una sola entidad con confirmación */
  eliminar(entidad: Entidad): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la entidad "${entidad.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.entidadesService.delete(entidad).subscribe({
          next: () => this.mostrarToast('success', 'Eliminada', `Entidad "${entidad.nombre}" eliminada`),
          error: (err: HttpErrorResponse) => this.manejarErrorServidor(err)
        });
      }
    });
  }

  /** Extrae y muestra errores del backend */
  private manejarErrorServidor(err: HttpErrorResponse): void {
    if (err.status === 422 && err.error.errors) {
      const msgs = Object.values(err.error.errors).flat().join(', ');
      this.mostrarToast('error', 'Error de validación', msgs);
    } else {
      this.mostrarToast('error', 'Error', err.error.message || 'Ocurrió un error inesperado');
    }
  }

  /** Muestra una notificación tipo toast */
  mostrarToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  // 
  // HELPERS PARA VALIDACIONES EN EL TEMPLATE
  // 

  /** Devuelve true si el campo tiene error y el usuario ya lo tocó */
  tieneError(campo: string): boolean {
    const control = this.entidadForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  /** Devuelve un mensaje de error según el tipo de validación que falló */
  mensajeError(campo: string): string {
    const control = this.entidadForm.get(campo);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['email']) return 'El formato del email no es válido';
    return 'Campo inválido';
  }
}
