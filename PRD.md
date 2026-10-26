# PRD — Prisma: Academic Focus & Task Manager

## 1. Identificación y Roles del Equipo
- **Construye:** Karen Sofia Vargas Fonseca
- **Producto:** Julieth Alexandra Ayala Burgos
- **Pruebas:** Andrea Lizeth Tellez Lopez
- **Publica:** Isabel Sofia Hernández Pelayo

---

## 2. Definición del Problema
Los estudiantes universitarios suelen dejar sus trabajos y actividades para última hora porque no organizan bien su tiempo ni sus prioridades. Esto les genera acumulación de tareas, estrés y dificultades para cumplir con sus responsabilidades académicas.

---

## 3. Perfil de Usuario
Estudiantes universitarios de pregrado y posgrado que experimentan fricción cognitiva, sobrecarga de información, desorganización temporal y tendencia a procrastinar ante entregas complejas.

---

## 4. Alcance y Funcionalidades Principales

### 4.1. Anotar tareas y fechas de entrega
- Registro claro de entregas con título, asignatura/materia, fecha y hora límite.
- Desglose anti-procrastinación en **micro-pasos** (bloques de 15 a 25 minutos) para reducir la barrera mental al comenzar.
- Estimación de tiempo y carga mental requerida.

### 4.2. Organizar las tareas según prioridad y fecha límite
- Clasificación visual por niveles de prioridad:
  - **Alta (Urgente / Crítica):** Exámenes, entregas en menos de 48 horas y proyectos con alta ponderación (Rojo Coral `#EF4444`).
  - **Media:** Tareas en curso y lecturas con vencimiento en la semana (Ámbar `#F59E0B`).
  - **Baja:** Tareas estables o lecturas de mediano plazo (Verde Esmeralda `#10B981`).
- Ordenamiento cronológico automático según proximidad de la fecha límite (indicadores de "Hoy", "Mañana", "En X días" y alertas de vencimiento).
- Filtros interactivos por asignatura y por nivel de prioridad.

### 4.3. Marcar tareas según su estado (Flujo de Progreso)
- Tablero visual Kanban dividido en los 3 estados fundamentales:
  1. 📌 **Pendientes:** Asignaciones anotadas que esperan inicio.
  2. ⏳ **En Proceso:** Tareas actualmente en desarrollo activo.
  3. ✅ **Terminadas:** Tareas concluidas, con tachado visual y actualización de métricas de efectividad.
- Capacidad de mover tareas entre estados con un solo clic o arrastrar y soltar (Drag & Drop).

---

## 5. Fuera del Alcance (Lo que NO hace la aplicación)
Conforme a la especificación oficial del producto:
- **No realiza las tareas por el estudiante.**
- **No entrega trabajos automáticamente.**
- **No bloquea otras aplicaciones ni exige conectarse con plataformas universitarias.**

---

## 6. Arquitectura y Experiencia de Usuario (Clarity Spectrum)
- **Estilo visual:** Minimalismo funcional moderno y luminoso con acentos cromáticos prismáticos.
- **Tipografía:** *Plus Jakarta Sans* para alta legibilidad en sesiones prolongadas de estudio.
- **Vistas del Sistema:**
  1. **Mi Día / Enfoque:** Panel diario con temporizador Pomodoro anti-procrastinación, métricas del día y primer micro-paso sugerido.
  2. **Tablero de Estados:** Tablero Kanban con las 3 columnas reglamentarias (Pendientes, En Proceso, Terminadas).
  3. **Calendario y Entregas:** Cronograma interactivo de fechas límite y entregas mensuales/semanales.
  4. **Anotar Tarea & Planificación:** Formulario de alta rápida y desglose de actividades.
