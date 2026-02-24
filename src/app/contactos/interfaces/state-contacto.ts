import { Contacto } from "./contacto";

/**
 * Interface para el estado interno del servicio de contactos.
 * Sigue el mismo patrón que StateEntidad.
 */
export interface StateContacto {
    contactos: Contacto[];
    loading: boolean;
}
