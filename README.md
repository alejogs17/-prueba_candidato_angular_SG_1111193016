**Prueba Técnica Angular - Garantías Comunitarias**  

A continuación, se describen las tareas que debes realizar en el framework Angular para completar esta prueba técnica:  

---

### **Tareas a realizar**  

1. **Configuración inicial:**  
   - Instala Angular localmente en tu entorno de desarrollo.  
   - Configura las variables de entorno para definir la URL del API Restful que se utilizará en los servicios.  

2. **Solución de errores:**  
   - Identifica y corrige posibles errores que impidan la correcta ejecución del Frontend.  

3. **Funcionalidad del CRUD de entidades:**  
   - **Botón eliminar:** Implementa la funcionalidad en el toolbar para permitir el borrado múltiple de entidades seleccionadas.  
   - **Formulario reactivo:**  
     - Crea un formulario reactivo que permita **crear y editar entidades**.  
     - Muestra el formulario en un modal al hacer clic en el botón correspondiente.  
   - **Métodos del CRUD:** Completa los métodos necesarios para que el CRUD esté completamente funcional, conectando con el API de Laravel proporcionado.  

4. **CRUD de contactos:**  
   - Implementa un CRUD similar al de entidades, con tabla, formularios reactivos y servicios.  
   - Asegúrate de que los contactos estén relacionados con una entidad:  
     - En el formulario reactivo de contactos, agrega un campo de selección (combo o autocomplete) para elegir entre las entidades listadas por el servicio de entidades.  

5. **Validaciones:**  
   - Implementa validaciones con mensajes claros para los formularios reactivos de entidades y contactos.  
   - Incluye advertencias específicas que ayuden al usuario a corregir errores al completar los formularios.  

---

### **Instrucciones de entrega**  

1. **Rama para cambios:**  
   - Clonar el repositorio en tu máquina local
   - Crea una rama en el repositorio siguiendo el formato: [Tus iniciales]_[Número de identificación].
   - Realiza todos los cambios necesarios en esta rama.

2. **Sube los cambios a tu repositorio:**  
   - Una vez completadas las tareas, sube tus cambios a un repositorio publico en tu cuenta de github. 
   - Envianos un correo con la ruta del repositorio.  

3. **Entrega alternativa:**  
   - Si encuentras dificultades para publicar en tu repositorio, sigue estos pasos: 
     - Comprime la carpeta del proyecto Angular.  
     - Excluye carpetas innecesarias como `node_modules`.  
     - Sube el archivo comprimido a una plataforma de almacenamiento en la nube (OneDrive, Google Drive, etc.).  
     - Comparte el enlace de descarga en un correo dirigido a la persona que te envió esta prueba.  

4. **Formato de entrega por correo:**  
   - Incluye en el correo una descripción breve del trabajo realizado y cualquier detalle relevante sobre la prueba.  

---

Si tienes alguna pregunta o necesitas asistencia técnica durante la ejecución de esta prueba, no dudes en comunicarte con el contacto que te proporcionó esta tarea. ¡Buena suerte! 😊

---

## **Tareas Completadas por el Candidato (Samir Alejandro Gonzalez Albis)**

A continuación se detallan los cambios y tareas ejecutadas durante la prueba técnica:

1. **Corrección de Errores Iniciales:**
   - Se arregló el CSS global en `styles.css` eliminando la regla `margin: 0; padding: 0;` en el `body` que afectaba el estilo y diseño responsivo de la librería PrimeNG.
   - Reparación en el componente `app.component.ts` configurando los imports de animaciones y HTTP cliente en la aplicación (Angular 17 Standalone).
   - Se actualizó el modelo `entidad.ts` y las entidades relacionadas, permitiendo la recepción correcta de la API de Laravel con *Observables*.

2. **CRUD Entidades:**
   - **Formulario Reacitvo (Modal):** Se habilitó un modal `<p-dialog>` con validación de datos (`FormGroup`).
   - **Borrado Múltiple:** Se implementó la lógica en la barra de herramientas (`Toolbar`) vinculada a un cuadro de confirmación modal (`ConfirmationService`) antes de emitir la eliminación en lote a Laravel.
   - Muestra dinámica de alertas con *Toaster* (`MessageService`).

3. **CRUD Contactos:**
   - Se unificó el servicio `ContactosService` utilizando el modelo `Contacto` incluyendo la relación hacia *Entidad*.
   - Se añadió un selector autocompletable (`p-dropdown`) cargando en tiempo de ejecución las entidades del Backend para el formulario modal interactivo.
   - Inclusión frontal controlada y en la tabla para los campos `Identificación`, `Apellido` y `Cargo`.

4. **Validaciones Estrictas (Manejo de Error HTTP 422):**
   - El formulario reactivo imposibilita envíos si hay campos vacíos.
   - En caso de que el API responda con códigos de duplicidad (Ej. Nombre, ID o Email ya existen en base de datos), Angular interceptará el `HttpErrorResponse` y lo mostrará limpia y directamente en pantalla como una alerta roja por *Toaster*.
   - Los comentarios del código fueron cuidadosamente simplificados para brindar legibilidad técnica.
