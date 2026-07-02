# 📋 Especificación Técnica: Dancing Flow (Refactorizado)

## 1. Identidad Visual (Oro y Negro Premium)
La plataforma utiliza un sistema de diseño de **alta densidad de información (SaaS)** con estética cinematográfica.

*   **Paleta de Colores:**
    *   `Fondo Principal`: `#000000` (Negro absoluto).
    *   `Superficies (Cards/Modales)`: `#051424` (Azul medianoche profundo) con `backdrop-blur-xl`.
    *   `Primario (Oro)`: `#D4AF37`. Usado en botones primarios, bordes activos y acentos.
    *   `Bordes`: `1px solid rgba(212, 175, 55, 0.2)` (Efecto filigrana de oro).
    *   `Texto`: Blanco brillante para títulos, `rgba(255,255,255,0.6)` para secundarios.

*   **Tipografía:**
    *   `Headers`: **Sora**. Estilo: `Uppercase`, `Italic`, `font-extrabold`, `tracking-tighter`.
    *   `Labels`: **Sora**. Estilo: `Uppercase`, `tracking-widest`, tamaño pequeño (10-12px).
    *   `Body`: **Inter**. Lectura cómoda, tamaño 14-16px.

---

## 2. Arquitectura de Software
Se ha eliminado la complejidad de "features" en favor de una estructura plana y mantenible:

*   **`src/views/`**: Contenedores de página (Home, About, Login, StudentProfile, StudentTraining, AdminControl).
*   **`src/components/ui/`**: Sistema de diseño atómico (`DFButton`, `DFCard`, `DFInput`, `DFTable`, etc.).
*   **`src/styles/`**: CSS modular en Tailwind v4 (utiliza `@utility` para encapsular estilos complejos).
*   **`src/store/useStore.js`**: Estado global con **Zustand**. Maneja persistencia de sesión, datos de usuario, alumnos y sockets.
*   **`src/services/api.js`**: Cliente API con `authFetch`. Inyecta automáticamente la cabecera `x-user-id` desde el `localStorage`.

---

## 3. Funcionalidades por Módulo

### A. Navegación (Navbar)
*   **Altura**: Fija en 56px (Desktop) / 64px (Mobile).
*   **Comportamiento**: `smoked-gold-glass` (negro translúcido con brillo oro).
*   **Botones**:
    *   `Inicio/Nosotros`: Públicos.
    *   `Entrar`: Redirige a Login.
    *   `Perfil/Clases`: Visibles solo para Alumnos.
    *   `Panel`: Visible solo para Profesores.
    *   `Salir`: Cierra sesión y limpia `localStorage` y Sockets.

### B. Vista de Alumno (Training)
*   **Grid de Clases**: Cards compactas con previsualización del tipo de contenido (Video/Audio/Texto).
*   **Interfaz de Mentoría**:
    *   **Izquierda**: Reproductor de video (si aplica) y guía de entrenamiento.
    *   **Derecha (Chat)**: Mensajería en tiempo real vía Socket.io.
    *   **Botones de Acción**:
        *   `Micrófono`: Grabación de audio (Hold to record).
        *   `Cámara (Solo PRO)`: Selector de archivos de video.
        *   `Enviar`: Postea texto/media al backend.

### C. Panel de Profesor (Admin)
Dashboard de alta densidad dividido en 4 secciones:
1.  **Estadísticas**: Gráficos bento-style de demografía (Nivel, Género, Progreso).
2.  **Alumnos**: Tabla con búsqueda instantánea.
    *   `Ver Perfil`: Abre modal con toda la data del cuestionario (miedos, metas, limitaciones físicas).
    *   `Toggle PRO`: Cambia el estatus `isPro` del alumno.
    *   `Eliminar`: Borra el registro tras confirmación.
3.  **Segmentación**: Agrupación automática de alumnos según respuestas del cuestionario (ej: "Prefiere solo grabación", "Con limitaciones físicas").
4.  **Gestión de Clases**:
    *   `Nueva Clase`: Formulario para subir contenido maestro (Video/Audio/Texto) y definir nivel.
    *   `Asignación`: Sistema de selección múltiple para asignar bloques a alumnos específicos.
    *   `Tracker de Feedback`: Lista de interacciones pendientes; permite al profesor responder directamente a cada alumno desde el panel.

---

## 4. Integración de Backend y Sockets
*   **Auth**: Basada en `x-user-id`. No se usan JWTs complejos para mantener la simplicidad.
*   **Real-time**: El servidor emite `new_message` y `online_users`. El cliente se une a salas por `assignmentId` para asegurar privacidad en el feedback.
*   **Persistencia**: El `Questionnaire` es una relación 1:1 con el `User`. Se actualiza automáticamente al completar el registro.

---

## 5. Reglas de Oro para Replicación
1.  **Densidad**: Nunca uses paddings excesivos. El diseño debe sentirse como una herramienta profesional, no una landing de marketing.
2.  **Consistencia**: Si un botón no es un `DFButton`, está mal. Si un color no está en `src/styles/colors.css`, está mal.
3.  **Rendimiento**: Vite está configurado para ignorar las carpetas de `db/` y `uploads/` para evitar recargas infinitas.
4.  **UX**: Todo feedback visual (SweetAlert2) debe seguir el tema `Oro y Negro` (fondo negro, botones oro).
