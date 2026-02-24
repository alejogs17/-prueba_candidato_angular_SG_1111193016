import { Entidad } from "../../entidades/interfaces/entidad";

/**
 * Interface Contacto:
 * Define la estructura de datos de un contacto.
 * La relación con Entidad se hace mediante entidad_id (clave foránea)
 * y opcionalmente el objeto entidad completo (cuando el API hace eager loading).
 */
export interface Contacto {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    cargo: string;
    identificacion: string;      // Campo obligatorio y único
    entidad_id: number;        // Clave foránea que relaciona el contacto con su entidad
    entidad?: Entidad;       // Objeto entidad completo (opcional, viene del API con relación)
    updated_at?: Date;
    created_at?: Date;
}
