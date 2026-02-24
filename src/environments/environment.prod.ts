// 📌 ENTORNO DE PRODUCCIÓN
// Este archivo se usa cuando ejecutas `ng build` (sin configuración de desarrollo)
// La URL apunta al servidor Laravel real en producción
export const environment = {
    production: true,
    apiUrl: 'http://127.0.0.1:8000/api/' // 👈 Cambiar por la URL real del servidor en producción
};
