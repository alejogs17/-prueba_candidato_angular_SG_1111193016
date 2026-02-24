import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown'; // Para el combo de entidades
import { TooltipModule } from 'primeng/tooltip';   // Para los tooltips

import { ContactosService } from './services/contactos.service';
import { EntidadesService } from '../entidades/services/entidades.service'; // Reutilizamos el servicio de entidades
import { Contacto } from './interfaces/contacto';
import { Entidad } from '../entidades/interfaces/entidad';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-contactos',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        DialogModule,
        InputTextModule,
        ConfirmDialogModule,
        DropdownModule,   // Para el selector de entidad en el formulario
        TooltipModule,    // Para los tooltips
    ],
    templateUrl: './contactos.component.html',
    styleUrl: './contactos.component.css',
    providers: [MessageService, ConfirmationService]
})
export default class ContactosComponent implements OnInit {
    public contactosService = inject(ContactosService);
    public entidadesService = inject(EntidadesService); // Para cargar las entidades en el combo

    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private fb = inject(FormBuilder);

    total = computed(() => this.contactosService.contactos().length);
    selectedContactos: Contacto[] = [];
    mostrarModal = false;
    contactoEnEdicion: Contacto | null = null;

    // FORMULARIO REACTIVO DE CONTACTOS
    // Incluye entidad_id con el selector de entidad
    contactoForm: FormGroup = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', [Validators.required]],
        cargo: ['', [Validators.required]],
        identificacion: ['', [Validators.required, Validators.minLength(5)]], // Nuevo campo
        entidad_id: [null, [Validators.required]], // Campo obligatorio: relación con entidad
    });

    ngOnInit(): void {
        // Nos aseguramos de que las entidades estén cargadas para el dropdown
        // El servicio ya las carga en su constructor, pero por si acaso llamamos refresh
        if (this.entidadesService.entidades().length === 0) {
            this.entidadesService.refresh();
        }
    }

    // 
    // MÉTODOS
    // 

    openNew(): void {
        this.contactoEnEdicion = null;
        this.contactoForm.reset();
        this.mostrarModal = true;
    }

    edit(contacto: Contacto): void {
        this.contactoEnEdicion = contacto;
        this.contactoForm.patchValue({
            nombre: contacto.nombre,
            apellido: contacto.apellido,
            email: contacto.email,
            telefono: contacto.telefono,
            cargo: contacto.cargo,
            identificacion: contacto.identificacion,
            entidad_id: contacto.entidad_id,
        });
        this.mostrarModal = true;
    }

    guardar(): void {
        if (this.contactoForm.invalid) {
            this.contactoForm.markAllAsTouched();
            return;
        }

        const datos = this.contactoForm.value;

        if (this.contactoEnEdicion) {
            this.contactosService.update({ ...this.contactoEnEdicion, ...datos }).subscribe({
                next: () => {
                    this.mostrarToast('success', 'Actualizado', `Contacto "${datos.nombre} ${datos.apellido}" actualizado`);
                    this.mostrarModal = false;
                    this.contactoForm.reset();
                },
                error: (err: HttpErrorResponse) => this.manejarErrorServidor(err)
            });
        } else {
            this.contactosService.create(datos).subscribe({
                next: () => {
                    this.mostrarToast('success', 'Creado', `Contacto "${datos.nombre} ${datos.apellido}" creado correctamente`);
                    this.mostrarModal = false;
                    this.contactoForm.reset();
                },
                error: (err: HttpErrorResponse) => this.manejarErrorServidor(err)
            });
        }
    }

    eliminarSeleccionados(): void {
        if (this.selectedContactos.length === 0) {
            this.mostrarToast('warn', 'Atención', 'Selecciona al menos un contacto para eliminar');
            return;
        }

        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar ${this.selectedContactos.length} contacto(s)?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.contactosService.deleteMultiple(this.selectedContactos);
                this.mostrarToast('success', 'Eliminados', `${this.selectedContactos.length} contacto(s) eliminados`);
                this.selectedContactos = [];
            }
        });
    }

    eliminar(contacto: Contacto): void {
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar a "${contacto.nombre} ${contacto.apellido}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.contactosService.delete(contacto).subscribe({
                    next: () => this.mostrarToast('success', 'Eliminado', `Contacto "${contacto.nombre}" eliminado`),
                    error: (err: HttpErrorResponse) => this.manejarErrorServidor(err)
                });
            }
        });
    }

    private manejarErrorServidor(err: HttpErrorResponse): void {
        if (err.status === 422 && err.error.errors) {
            const msgs = Object.values(err.error.errors).flat().join(', ');
            this.mostrarToast('error', 'Error de validación', msgs);
        } else {
            this.mostrarToast('error', 'Error', err.error.message || 'Ocurrió un error inesperado');
        }
    }

    mostrarToast(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity, summary, detail, life: 3000 });
    }

    // 
    // HELPERS PARA VALIDACIONES
    // 

    tieneError(campo: string): boolean {
        const control = this.contactoForm.get(campo);
        return !!(control && control.invalid && control.touched);
    }

    mensajeError(campo: string): string {
        const control = this.contactoForm.get(campo);
        if (!control || !control.errors) return '';
        if (control.errors['required']) return 'Este campo es obligatorio';
        if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
        if (control.errors['email']) return 'El formato del email no es válido';
        return 'Campo inválido';
    }

    /** Devuelve el nombre de la entidad dado su id (para mostrarlo en la tabla) */
    getNombreEntidad(entidad_id: number): string {
        const entidad = this.entidadesService.entidades().find(e => e.id === entidad_id);
        return entidad ? entidad.nombre : '—';
    }
}
