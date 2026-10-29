/**
 * PRISMA — Academic Focus & Task Manager
 * Sistema de Gestión de Tareas y Enfoque para Estudiantes Universitarios
 * Equipo:
 * - Construye: Karen Sofia Vargas Fonseca
 * - Producto: Julieth Alexandra Ayala Burgos
 * - Pruebas: Andrea Lizeth Tellez Lopez
 * - Publica: Isabel Sofia Hernández Pelayo
 */

// ==========================================
// 1. CONFIGURACIÓN Y ESTADO INICIAL
// ==========================================

const SUBJECTS_CONFIG = {
  'Cálculo Multivariable': { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  'Algoritmos y Datos': { color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  'Física Mecánica': { color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  'Arquitectura Software': { color: 'bg-teal-100 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
  'Ética y Sociedad': { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'General': { color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' }
};

const PRIORITY_CONFIG = {
  high: { label: 'Alta', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500', icon: 'priority_high', order: 1 },
  medium: { label: 'Media', color: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500', icon: 'schedule', order: 2 },
  low: { label: 'Baja', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500', icon: 'low_priority', order: 3 }
};

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', title: 'Pendientes', icon: 'pending_actions', color: 'text-amber-600' },
  in_progress: { label: 'En Proceso', title: 'En Proceso', icon: 'timelapse', color: 'text-indigo-600' },
  completed: { label: 'Terminada', title: 'Terminadas', icon: 'check_circle', color: 'text-emerald-600' }
};

// Generador de fechas relativas a hoy para que la demo siempre se vea con fechas actuales
function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Taller 3: Teorema de Green y Stokes',
    subject: 'Cálculo Multivariable',
    dueDate: getDateOffset(0), // Hoy
    dueTime: '23:59',
    priority: 'high',
    status: 'in_progress',
    estimatedMinutes: 60,
    microSteps: [
      { text: 'Repasar apuntes de integrales de línea', done: true },
      { text: 'Resolver ejercicios 1 al 4 (Green)', done: true },
      { text: 'Resolver ejercicios 5 y 6 (Stokes)', done: false },
      { text: 'Exportar a PDF con carátula', done: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Proyecto: Implementación de Grafos con Dijkstra',
    subject: 'Algoritmos y Datos',
    dueDate: getDateOffset(1), // Mañana
    dueTime: '18:00',
    priority: 'high',
    status: 'in_progress',
    estimatedMinutes: 90,
    microSteps: [
      { text: 'Estructurar clase Nodo y Grafo', done: true },
      { text: 'Implementar cola de prioridad mínima', done: false },
      { text: 'Escribir casos de prueba unitarios', done: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Informe de Laboratorio: Movimiento Armónico',
    subject: 'Física Mecánica',
    dueDate: getDateOffset(2),
    dueTime: '12:00',
    priority: 'medium',
    status: 'pending',
    estimatedMinutes: 45,
    microSteps: [
      { text: 'Tabular datos de oscilaciones del resorte', done: false },
      { text: 'Graficar curva de ajuste y calcular constante K', done: false },
      { text: 'Redactar conclusiones del informe', done: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'Diagrama C4 de la Arquitectura del Sistema',
    subject: 'Arquitectura Software',
    dueDate: getDateOffset(4),
    dueTime: '20:00',
    priority: 'medium',
    status: 'pending',
    estimatedMinutes: 50,
    microSteps: [
      { text: 'Nivel 1: Diagrama de Contexto', done: false },
      { text: 'Nivel 2: Diagrama de Contenedores', done: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-5',
    title: 'Ensayo Crítico sobre IA y Responsabilidad Profesional',
    subject: 'Ética y Sociedad',
    dueDate: getDateOffset(-1), // Ayer / Completada
    dueTime: '23:59',
    priority: 'low',
    status: 'completed',
    estimatedMinutes: 40,
    microSteps: [
      { text: 'Lectura del artículo asignado', done: true },
      { text: 'Redactar introducción y tesis', done: true },
      { text: 'Revisión bibliográfica en formato APA', done: true }
    ],
    createdAt: new Date().toISOString()
  }
];

// Estado global de la aplicación
const AppState = {
  tasks: [],
  user: {
    name: '',
    career: '',
    university: '',
    isRegistered: false
  },
  currentView: 'mi-dia',
  filterPriority: 'all',
  filterSubject: 'all',
  searchQuery: '',
  selectedCalendarDate: new Date().toISOString().split('T')[0],
  pomodoro: {
    duration: 25 * 60,
    remaining: 25 * 60,
    isRunning: false,
    timerId: null,
    mode: 'focus' // 'focus', 'shortBreak', 'longBreak'
  }
};

// ==========================================
// 2. PERSISTENCIA EN LOCALSTORAGE Y PERFIL
// ==========================================

function getInitials(name) {
  if (!name) return 'ES';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getFirstName(name) {
  if (!name) return 'Estudiante';
  return name.trim().split(/\s+/)[0];
}

function loadUser() {
  try {
    const saved = localStorage.getItem('prisma_user_v1');
    if (saved) {
      AppState.user = JSON.parse(saved);
    } else {
      AppState.user = {
        name: '',
        career: '',
        university: '',
        isRegistered: false
      };
    }
  } catch (e) {
    AppState.user = { name: '', career: '', university: '', isRegistered: false };
  }
}

function saveUser() {
  try {
    localStorage.setItem('prisma_user_v1', JSON.stringify(AppState.user));
  } catch (e) {
    console.error('Error guardando usuario:', e);
  }
}

function applyUserProfile() {
  const user = AppState.user;
  const isReg = user && user.isRegistered && user.name;
  const displayName = isReg ? user.name : 'Estudiante';
  const firstName = isReg ? getFirstName(user.name) : 'Estudiante';
  const displayCareer = isReg ? (user.career + (user.university ? ' • ' + user.university : '')) : 'Mi Carrera • Racha 5d 🔥';
  const initials = isReg ? getInitials(user.name) : 'ES';

  // Sidebar
  const sbInit = document.getElementById('sidebarUserInitials');
  const sbName = document.getElementById('sidebarUserName');
  const sbCareer = document.getElementById('sidebarUserCareer');
  if (sbInit) sbInit.textContent = initials;
  if (sbName) sbName.textContent = displayName;
  if (sbCareer) sbCareer.textContent = displayCareer;

  // Header
  const hdInit = document.getElementById('headerUserInitials');
  if (hdInit) hdInit.textContent = initials;

  // Mi Día View
  const mdAvatar = document.getElementById('miDiaUserAvatar');
  const mdGreeting = document.getElementById('miDiaGreetingName');
  const mdCareer = document.getElementById('miDiaCareerSubtitle');
  if (mdAvatar) mdAvatar.textContent = initials;
  if (mdGreeting) mdGreeting.textContent = `¡Hola, ${firstName}! 👋`;
  if (mdCareer) mdCareer.textContent = isReg 
    ? `${user.career} • Semana académica activa • Tienes entregas organizadas listas para desglosar.`
    : `Semana académica activa • Tienes entregas con prioridad alta listas para desglosar.`;

  // Profile Modal Avatar
  const pmAvatar = document.getElementById('profileModalAvatar');
  if (pmAvatar) pmAvatar.textContent = initials;

  // Inputs en modal de perfil
  const pName = document.getElementById('profileNameInput');
  const pCareer = document.getElementById('profileCareerInput');
  const pUni = document.getElementById('profileUniInput');
  if (pName) pName.value = user.name || '';
  if (pCareer) pCareer.value = user.career || '';
  if (pUni) pUni.value = user.university || '';
}

function checkOnboarding() {
  const modal = document.getElementById('onboardingModal');
  if (!modal) return;
  if (!AppState.user.isRegistered) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

window.handleOnboardingSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('onboardNameInput').value.trim();
  const career = document.getElementById('onboardCareerInput').value.trim();
  const uni = document.getElementById('onboardUniInput')?.value.trim() || '';
  const mode = document.querySelector('input[name="onboardMode"]:checked')?.value || 'sample';

  if (!name || !career) {
    showToast('Por favor completa tu nombre y carrera', 'warning');
    return;
  }

  AppState.user = {
    name,
    career,
    university: uni,
    isRegistered: true
  };
  saveUser();

  if (mode === 'clean') {
    AppState.tasks = [];
    saveTasks();
  } else {
    // Si no habían tareas, cargar tareas de ejemplo
    if (AppState.tasks.length === 0) {
      AppState.tasks = [...INITIAL_TASKS];
      saveTasks();
    }
  }

  const modal = document.getElementById('onboardingModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  applyUserProfile();
  renderActiveView();
  playChime('success');
  triggerConfetti();
  showToast(`¡Bienvenido(a) a Prisma, ${getFirstName(name)}!`);
};

window.continueAsGuest = function() {
  AppState.user = {
    name: 'Estudiante Invitado',
    career: 'Universidad',
    university: '',
    isRegistered: true
  };
  saveUser();
  const modal = document.getElementById('onboardingModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  applyUserProfile();
  renderActiveView();
  showToast('Modo invitado activado');
};

window.openProfileModal = function() {
  applyUserProfile();
  const modal = document.getElementById('profileModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeProfileModal = function() {
  const modal = document.getElementById('profileModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleProfileUpdateSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('profileNameInput').value.trim();
  const career = document.getElementById('profileCareerInput').value.trim();
  const uni = document.getElementById('profileUniInput').value.trim();

  AppState.user.name = name;
  AppState.user.career = career;
  AppState.user.university = uni;
  AppState.user.isRegistered = true;
  saveUser();

  applyUserProfile();
  closeProfileModal();
  renderActiveView();
  showToast('Perfil actualizado con éxito');
};

window.logoutUser = function() {
  if (confirm('¿Deseas cerrar sesión para que otra persona pueda ingresar sus datos y registrarse?')) {
    AppState.user = {
      name: '',
      career: '',
      university: '',
      isRegistered: false
    };
    localStorage.removeItem('prisma_user_v1');
    closeProfileModal();
    applyUserProfile();
    checkOnboarding();
    showToast('Sesión cerrada. Puedes ingresar un nuevo perfil.');
  }
};

window.exportTasksJson = function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `prisma-tareas-${AppState.user.name ? AppState.user.name.toLowerCase().replace(/\s+/g, '-') : 'estudiante'}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Archivo JSON de tareas descargado');
};

function loadTasks() {
  try {
    const saved = localStorage.getItem('prisma_tasks_v1');
    if (saved) {
      AppState.tasks = JSON.parse(saved);
    } else {
      // Si el usuario ya está registrado pero no tiene tareas, no forzar tareas iniciales
      if (!AppState.user || !AppState.user.isRegistered) {
        AppState.tasks = [...INITIAL_TASKS];
        saveTasks();
      } else {
        AppState.tasks = [];
      }
    }
  } catch (err) {
    console.warn('Error leyendo localStorage, usando datos iniciales:', err);
    AppState.tasks = [...INITIAL_TASKS];
  }
}

function saveTasks() {
  try {
    localStorage.setItem('prisma_tasks_v1', JSON.stringify(AppState.tasks));
  } catch (err) {
    console.error('Error guardando en localStorage:', err);
  }
}

// ==========================================
// 3. AUDIO Y EFECTOS VISUALES (WEB AUDIO API)
// ==========================================

function playChime(type = 'success') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'success') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.3); // D6

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.45);
      osc2.stop(ctx.currentTime + 0.45);
    } else if (type === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    }
  } catch (e) {
    // Audio opcional si el navegador bloquea autoplay
  }
}

// Confetti en Canvas para celebrar terminación de tareas
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#4f46e5', '#712ae2', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 10
    });
  }

  let frames = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // Gravedad
      p.alpha -= 0.018;
      p.rotation += p.vrot;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    frames++;
    if (alive && frames < 70) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

// ==========================================
// 4. TEMPORIZADOR POMODORO ANTI-PROCRASTINACIÓN
// ==========================================

function initPomodoro() {
  const timerDisplay = document.getElementById('pomodoroDisplay');
  const timerLabel = document.getElementById('pomodoroModeLabel');
  const startBtn = document.getElementById('pomodoroStartBtn');
  const resetBtn = document.getElementById('pomodoroResetBtn');

  function updateDisplay() {
    const minutes = Math.floor(AppState.pomodoro.remaining / 60);
    const seconds = AppState.pomodoro.remaining % 60;
    const str = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (timerDisplay) timerDisplay.textContent = str;
    const quickTimer = document.getElementById('quickPomodoroDisplay');
    if (quickTimer) quickTimer.textContent = str;
  }

  window.togglePomodoro = function () {
    if (AppState.pomodoro.isRunning) {
      clearInterval(AppState.pomodoro.timerId);
      AppState.pomodoro.isRunning = false;
      if (startBtn) startBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">play_arrow</span><span>Iniciar Foco</span>';
    } else {
      AppState.pomodoro.isRunning = true;
      if (startBtn) startBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">pause</span><span>Pausar</span>';
      AppState.pomodoro.timerId = setInterval(() => {
        if (AppState.pomodoro.remaining > 0) {
          AppState.pomodoro.remaining--;
          updateDisplay();
        } else {
          clearInterval(AppState.pomodoro.timerId);
          AppState.pomodoro.isRunning = false;
          playChime('bell');
          showToast('¡Bloque de enfoque completado! Tómate un respiro.');
          window.setPomodoroMode(AppState.pomodoro.mode === 'focus' ? 'shortBreak' : 'focus');
        }
      }, 1000);
    }
  };

  window.resetPomodoro = function () {
    clearInterval(AppState.pomodoro.timerId);
    AppState.pomodoro.isRunning = false;
    AppState.pomodoro.remaining = AppState.pomodoro.duration;
    if (startBtn) startBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">play_arrow</span><span>Iniciar Foco</span>';
    updateDisplay();
  };

  window.setPomodoroMode = function (mode) {
    clearInterval(AppState.pomodoro.timerId);
    AppState.pomodoro.isRunning = false;
    AppState.pomodoro.mode = mode;

    if (mode === 'focus') {
      AppState.pomodoro.duration = 25 * 60;
      if (timerLabel) timerLabel.textContent = 'Enfoque Profundo (25m)';
    } else if (mode === 'shortBreak') {
      AppState.pomodoro.duration = 5 * 60;
      if (timerLabel) timerLabel.textContent = 'Descanso Corto (5m)';
    } else if (mode === 'longBreak') {
      AppState.pomodoro.duration = 15 * 60;
      if (timerLabel) timerLabel.textContent = 'Descanso Largo (15m)';
    }

    AppState.pomodoro.remaining = AppState.pomodoro.duration;
    if (startBtn) startBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">play_arrow</span><span>Iniciar</span>';
    updateDisplay();

    // Actualizar tabs de botones de modo
    document.querySelectorAll('[data-pomodoro-tab]').forEach(btn => {
      const active = btn.getAttribute('data-pomodoro-tab') === mode;
      btn.className = active
        ? 'px-3 py-1 text-xs font-semibold rounded-lg bg-primary text-on-primary shadow-sm'
        : 'px-3 py-1 text-xs font-medium rounded-lg text-on-surface-variant hover:bg-surface-container';
    });
  };

  updateDisplay();
}

// ==========================================
// 5. NAVEGACIÓN Y CAMBIO DE VISTAS
// ==========================================

function navigateTo(viewName) {
  AppState.currentView = viewName;

  // Actualizar visibilidad de secciones principales
  const views = ['mi-dia', 'tablero', 'calendario', 'anotar-tarea'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === viewName) {
        el.classList.remove('hidden');
        el.classList.add('animate-fade-in');
      } else {
        el.classList.add('hidden');
        el.classList.remove('animate-fade-in');
      }
    }
  });

  // Actualizar estilos activos en sidebar
  document.querySelectorAll('[data-nav-target]').forEach(link => {
    const target = link.getAttribute('data-nav-target');
    if (target === viewName) {
      link.className = 'flex items-center gap-space-sm px-space-md py-space-sm rounded-xl font-label-md text-label-md bg-primary-container text-on-primary shadow-sm transition-all';
    } else {
      link.className = 'flex items-center gap-space-sm px-space-md py-space-sm rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all';
    }
  });

  // Re-renderizar la vista activa
  renderActiveView();
}

function renderActiveView() {
  updateMetrics();
  if (AppState.currentView === 'mi-dia') {
    renderMiDia();
  } else if (AppState.currentView === 'tablero') {
    renderTablero();
  } else if (AppState.currentView === 'calendario') {
    renderCalendario();
  } else if (AppState.currentView === 'anotar-tarea') {
    // Si navega directamente a la pantalla de anotar tarea
    resetTaskForm();
  }
}

// ==========================================
// 6. FILTROS Y ORDENAMIENTO
// ==========================================

function getFilteredTasks() {
  return AppState.tasks.filter(task => {
    // Filtro por búsqueda
    if (AppState.searchQuery) {
      const q = AppState.searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchSubject = task.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject) return false;
    }
    // Filtro por prioridad
    if (AppState.filterPriority !== 'all' && task.priority !== AppState.filterPriority) {
      return false;
    }
    // Filtro por materia
    if (AppState.filterSubject !== 'all' && task.subject !== AppState.filterSubject) {
      return false;
    }
    return true;
  });
}

function sortTasksByUrgency(tasks) {
  return [...tasks].sort((a, b) => {
    // 1. Primero por fecha de entrega
    const dateA = new Date(`${a.dueDate}T${a.dueTime || '23:59'}`);
    const dateB = new Date(`${b.dueDate}T${b.dueTime || '23:59'}`);
    if (dateA - dateB !== 0) return dateA - dateB;

    // 2. Si es misma fecha, por prioridad (high > medium > low)
    const prioOrder = { high: 1, medium: 2, low: 3 };
    return prioOrder[a.priority] - prioOrder[b.priority];
  });
}

function getDueBadgeInfo(dueDateStr, dueTimeStr) {
  const todayStr = new Date().toISOString().split('T')[0];
  const due = new Date(`${dueDateStr}T${dueTimeStr || '23:59'}`);
  const now = new Date();

  // Diferencia en días
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (dueDateStr === todayStr) {
    return { text: `Hoy ${dueTimeStr || ''}`, class: 'bg-red-100 text-red-700 font-bold animate-pulse', urgent: true };
  } else if (diffDays === 1) {
    return { text: `Mañana ${dueTimeStr || ''}`, class: 'bg-amber-100 text-amber-800 font-semibold', urgent: true };
  } else if (diffDays < 0) {
    return { text: `Atrasada (${Math.abs(diffDays)}d)`, class: 'bg-rose-200 text-rose-900 font-bold', urgent: true };
  } else {
    return { text: `En ${diffDays} días`, class: 'bg-slate-100 text-slate-700 font-medium', urgent: false };
  }
}

// ==========================================
// 7. RENDER: MI DÍA / ENFOQUE
// ==========================================

function renderMiDia() {
  const container = document.getElementById('miDiaTaskList');
  if (!container) return;

  const tasks = getFilteredTasks();
  const sorted = sortTasksByUrgency(tasks);

  // Seleccionar la tarea más urgente activa para el "Paso Inmediato Anti-Procrastinación"
  const activeUrgent = sorted.find(t => t.status !== 'completed');
  const heroSuggested = document.getElementById('antiProcrastinationStep');
  if (heroSuggested) {
    if (activeUrgent) {
      const nextStep = activeUrgent.microSteps?.find(s => !s.done);
      heroSuggested.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[18px]">flag</span>
          </div>
          <div>
            <div class="text-xs uppercase font-bold text-primary tracking-wider">Paso Sugerido Anti-Procrastinación</div>
            <div class="text-sm font-semibold text-on-surface">${nextStep ? nextStep.text : activeUrgent.title}</div>
            <div class="text-xs text-on-surface-variant">De la tarea: <span class="font-medium text-primary">${activeUrgent.title}</span> (${activeUrgent.subject})</div>
          </div>
        </div>
        <button onclick="quickStartTask('${activeUrgent.id}')" class="px-3.5 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-semibold shadow-sm hover:bg-primary-container transition-all flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-[16px]">play_circle</span>
          <span>Enfocar Ahora</span>
        </button>
      `;
    } else {
      heroSuggested.innerHTML = `
        <div class="flex items-center gap-3 text-emerald-700">
          <span class="material-symbols-outlined text-[24px]">task_alt</span>
          <div>
            <div class="text-sm font-bold">¡Día al día! No tienes tareas pendientes urgentes.</div>
            <div class="text-xs text-emerald-600">Disfruta tu tiempo libre o adelanta un proyecto con calma.</div>
          </div>
        </div>
      `;
    }
  }

  // Renderizar la lista de tareas del día
  if (sorted.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">assignment_turned_in</span>
        <p class="text-on-surface font-semibold text-sm">No hay tareas que coincidan con los filtros</p>
        <p class="text-xs text-on-surface-variant mt-1">Crea una nueva tarea o cambia tus filtros de búsqueda.</p>
        <button onclick="openNewTaskModal()" class="mt-4 px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold shadow-sm hover:bg-primary-container">
          + Anotar Primera Tarea
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = sorted.map(task => {
    const isDone = task.status === 'completed';
    const subj = SUBJECTS_CONFIG[task.subject] || SUBJECTS_CONFIG['General'];
    const prio = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['medium'];
    const due = getDueBadgeInfo(task.dueDate, task.dueTime);

    const completedSteps = task.microSteps ? task.microSteps.filter(s => s.done).length : 0;
    const totalSteps = task.microSteps ? task.microSteps.length : 0;
    const stepsProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return `
      <div class="p-4 bg-surface-container-lowest rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group">
        <div class="flex items-start justify-between gap-3">
          <!-- Checkbox y Título -->
          <div class="flex items-start gap-3 flex-1">
            <button onclick="toggleTaskStatus('${task.id}')" class="mt-0.5 w-6 h-6 rounded-lg border-2 ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-primary'} flex items-center justify-center transition-all shrink-0" title="${isDone ? 'Marcar como pendiente' : 'Marcar como terminada'}">
              ${isDone ? '<span class="material-symbols-outlined text-[16px]">check</span>' : ''}
            </button>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold border ${subj.color}">${task.subject}</span>
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold border ${prio.color} flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full ${prio.dot}"></span>
                  <span>Prioridad ${prio.label}</span>
                </span>
                <span class="px-2 py-0.5 rounded-full text-xs ${due.class} flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">event</span>
                  <span>${due.text}</span>
                </span>
              </div>
              <h3 class="font-semibold text-sm text-on-surface ${isDone ? 'line-through text-slate-400' : ''}">${escapeHtml(task.title)}</h3>
            </div>
          </div>

          <!-- Selector de Estado & Acciones -->
          <div class="flex items-center gap-1.5 shrink-0">
            <select onchange="changeTaskStatus('${task.id}', this.value)" class="text-xs font-semibold py-1 px-2 rounded-lg bg-surface-container border border-slate-200 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>📌 Pendiente</option>
              <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>⏳ En Proceso</option>
              <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>✅ Terminada</option>
            </select>
            <button onclick="deleteTask('${task.id}')" class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all" title="Eliminar tarea">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>

        <!-- Micro-Pasos Desplegables -->
        ${totalSteps > 0 ? `
          <div class="bg-surface-container-low/70 rounded-lg p-2.5 space-y-1.5 border border-slate-100">
            <div class="flex items-center justify-between text-xs text-on-surface-variant font-medium">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px] text-primary">checklist</span>
                <span>Desglose en micro-pasos (${completedSteps}/${totalSteps})</span>
              </span>
              <span class="font-bold text-primary">${stepsProgress}%</span>
            </div>
            <!-- Barra de progreso -->
            <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div class="bg-primary h-full transition-all duration-300" style="width: ${stepsProgress}%"></div>
            </div>
            <!-- Lista de pasos -->
            <div class="pt-1 space-y-1">
              ${task.microSteps.map((step, sIdx) => `
                <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none hover:text-primary">
                  <input type="checkbox" ${step.done ? 'checked' : ''} onchange="toggleMicroStep('${task.id}', ${sIdx})" class="rounded border-slate-300 text-primary focus:ring-primary h-3.5 w-3.5">
                  <span class="${step.done ? 'line-through text-slate-400' : ''}">${escapeHtml(step.text)}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// ==========================================
// 8. RENDER: TABLERO DE ESTADOS (KANBAN)
// ==========================================

function renderTablero() {
  const tasks = getFilteredTasks();

  const columns = [
    { id: 'pending', title: 'Pendientes', icon: 'pending_actions', bg: 'bg-amber-500/10 text-amber-700' },
    { id: 'in_progress', title: 'En Proceso', icon: 'timelapse', bg: 'bg-indigo-500/10 text-indigo-700' },
    { id: 'completed', title: 'Terminadas', icon: 'check_circle', bg: 'bg-emerald-500/10 text-emerald-700' }
  ];

  columns.forEach(col => {
    const colContainer = document.getElementById(`kanban-col-${col.id}`);
    const countBadge = document.getElementById(`kanban-count-${col.id}`);
    if (!colContainer) return;

    const colTasks = sortTasksByUrgency(tasks.filter(t => t.status === col.id));
    if (countBadge) countBadge.textContent = colTasks.length;

    if (colTasks.length === 0) {
      colContainer.innerHTML = `
        <div class="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
          <span class="material-symbols-outlined text-[20px] mb-1">drag_indicator</span>
          <span>Arrastra tareas aquí o cámbialas de estado</span>
        </div>
      `;
      return;
    }

    colContainer.innerHTML = colTasks.map(task => {
      const subj = SUBJECTS_CONFIG[task.subject] || SUBJECTS_CONFIG['General'];
      const prio = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['medium'];
      const due = getDueBadgeInfo(task.dueDate, task.dueTime);
      const isDone = task.status === 'completed';

      const completedSteps = task.microSteps ? task.microSteps.filter(s => s.done).length : 0;
      const totalSteps = task.microSteps ? task.microSteps.length : 0;

      return `
        <div class="kanban-card bg-surface-container-lowest p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex flex-col gap-2.5"
             draggable="true"
             ondragstart="handleDragStart(event, '${task.id}')"
             ondragend="handleDragEnd(event)">
          
          <!-- Encabezado de la tarjeta: Materia y Prioridad -->
          <div class="flex items-center justify-between gap-2">
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold border ${subj.color}">${task.subject}</span>
            <span class="w-2.5 h-2.5 rounded-full ${prio.dot}" title="Prioridad ${prio.label}"></span>
          </div>

          <!-- Título -->
          <h4 class="font-semibold text-sm text-on-surface ${isDone ? 'line-through text-slate-400' : ''}">${escapeHtml(task.title)}</h4>

          <!-- Micro-pasos indicador -->
          ${totalSteps > 0 ? `
            <div class="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">checklist</span>
                <span>${completedSteps}/${totalSteps} micro-pasos</span>
              </span>
              <span class="font-bold text-primary">${Math.round((completedSteps / totalSteps) * 100)}%</span>
            </div>
          ` : ''}

          <!-- Footer con Fecha y Botones de movimiento rápido -->
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
            <span class="text-xs px-2 py-0.5 rounded-full ${due.class} flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">event</span>
              <span>${due.text}</span>
            </span>

            <div class="flex items-center gap-1">
              ${col.id !== 'pending' ? `
                <button onclick="moveTaskCol('${task.id}', -1)" class="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all" title="Mover a la izquierda">
                  <span class="material-symbols-outlined text-[14px]">chevron_left</span>
                </button>
              ` : ''}
              ${col.id !== 'completed' ? `
                <button onclick="moveTaskCol('${task.id}', 1)" class="w-6 h-6 rounded bg-primary-container text-white hover:bg-primary flex items-center justify-center transition-all shadow-sm" title="Mover a la derecha">
                  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              ` : ''}
              <button onclick="deleteTask('${task.id}')" class="w-6 h-6 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all" title="Eliminar">
                <span class="material-symbols-outlined text-[14px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  });
}

// Drag and drop handlers
let draggedTaskId = null;

window.handleDragStart = function (e, taskId) {
  draggedTaskId = taskId;
  e.dataTransfer.setData('text/plain', taskId);
  e.target.classList.add('dragging');
};

window.handleDragEnd = function (e) {
  e.target.classList.remove('dragging');
  document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
};

window.handleDragOver = function (e) {
  e.preventDefault();
  const col = e.currentTarget;
  col.classList.add('drag-over');
};

window.handleDragLeave = function (e) {
  e.currentTarget.classList.remove('drag-over');
};

window.handleDrop = function (e, targetStatus) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (draggedTaskId) {
    changeTaskStatus(draggedTaskId, targetStatus);
    draggedTaskId = null;
  }
};

window.moveTaskCol = function (taskId, direction) {
  const task = AppState.tasks.find(t => t.id === taskId);
  if (!task) return;
  const statusFlow = ['pending', 'in_progress', 'completed'];
  const currentIndex = statusFlow.indexOf(task.status);
  const newIndex = currentIndex + direction;
  if (newIndex >= 0 && newIndex < statusFlow.length) {
    changeTaskStatus(taskId, statusFlow[newIndex]);
  }
};

// ==========================================
// 9. RENDER: CALENDARIO & ENTREGAS
// ==========================================

function renderCalendario() {
  const calendarContainer = document.getElementById('calendarDaysGrid');
  const monthTitle = document.getElementById('calendarMonthTitle');
  const upcomingList = document.getElementById('calendarUpcomingDeliveries');
  if (!calendarContainer) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (monthTitle) {
    monthTitle.textContent = `${monthNames[month]} ${year}`;
  }

  // Primer día del mes y total de días
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  // Día de la semana en que inicia (Lunes = 0)
  let startingDay = firstDay.getDay() - 1;
  if (startingDay === -1) startingDay = 6;

  let daysHtml = '';

  // Días vacíos previos
  for (let i = 0; i < startingDay; i++) {
    daysHtml += `<div class="min-h-[85px] bg-slate-50/50 rounded-xl border border-slate-100 opacity-30"></div>`;
  }

  // Tareas filtradas agrupadas por fecha
  const tasks = getFilteredTasks();

  for (let day = 1; day <= totalDays; day++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate === dayStr);
    const isToday = dayStr === now.toISOString().split('T')[0];
    const isSelected = dayStr === AppState.selectedCalendarDate;

    daysHtml += `
      <div onclick="selectCalendarDate('${dayStr}')" class="min-h-[92px] p-2 rounded-xl border ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : isToday ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200 bg-surface-container-lowest'} hover:border-primary transition-all cursor-pointer flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs ${isToday ? 'w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center' : 'text-on-surface'}">${day}</span>
          ${dayTasks.length > 0 ? `<span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full ${dayTasks.some(t => t.priority === 'high') ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}">${dayTasks.length}</span>` : ''}
        </div>

        <div class="space-y-1 mt-1 overflow-hidden">
          ${dayTasks.slice(0, 2).map(t => {
            const prio = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG['medium'];
            return `
              <div class="text-[10px] font-semibold truncate px-1.5 py-0.5 rounded ${t.status === 'completed' ? 'bg-slate-100 text-slate-400 line-through' : 'bg-surface-container text-on-surface border-l-2 ' + prio.dot.replace('bg-', 'border-')}" title="${escapeHtml(t.title)} (${t.subject})">
                ${escapeHtml(t.title)}
              </div>
            `;
          }).join('')}
          ${dayTasks.length > 2 ? `<div class="text-[9px] text-slate-400 font-medium">+${dayTasks.length - 2} más</div>` : ''}
        </div>
      </div>
    `;
  }

  calendarContainer.innerHTML = daysHtml;

  // Renderizar la lista cronológica lateral de próximas entregas
  if (upcomingList) {
    const upcoming = sortTasksByUrgency(tasks.filter(t => t.status !== 'completed'));

    if (upcoming.length === 0) {
      upcomingList.innerHTML = `
        <div class="text-center p-6 text-slate-400 text-xs">
          <span class="material-symbols-outlined text-[24px] mb-1">done_all</span>
          <p>No tienes entregas pendientes próximas.</p>
        </div>
      `;
    } else {
      upcomingList.innerHTML = upcoming.map(t => {
        const prio = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG['medium'];
        const due = getDueBadgeInfo(t.dueDate, t.dueTime);
        const subj = SUBJECTS_CONFIG[t.subject] || SUBJECTS_CONFIG['General'];

        return `
          <div class="p-3 bg-surface-container-lowest rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-2 hover:border-primary transition-all">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 mb-1">
                <span class="w-2 h-2 rounded-full ${prio.dot}"></span>
                <span class="text-[11px] font-bold text-slate-600 truncate">${t.subject}</span>
              </div>
              <h5 class="text-xs font-semibold text-on-surface truncate">${escapeHtml(t.title)}</h5>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[10px] px-2 py-0.5 rounded-full ${due.class} font-bold">${due.text}</span>
              </div>
            </div>
            <button onclick="toggleTaskStatus('${t.id}')" class="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="Marcar como terminada">
              <span class="material-symbols-outlined text-[18px]">check_circle</span>
            </button>
          </div>
        `;
      }).join('');
    }
  }
}

window.selectCalendarDate = function (dateStr) {
  AppState.selectedCalendarDate = dateStr;
  renderCalendario();
};

// ==========================================
// 10. GESTIÓN Y CRUD DE TAREAS
// ==========================================

window.openNewTaskModal = function (prefilledDate = null) {
  const modal = document.getElementById('taskModal');
  if (!modal) return;

  const dateInput = document.getElementById('taskDueDateInput');
  if (dateInput) {
    dateInput.value = prefilledDate || new Date().toISOString().split('T')[0];
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeNewTaskModal = function () {
  const modal = document.getElementById('taskModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  resetTaskForm();
};

function resetTaskForm() {
  const title = document.getElementById('taskTitleInput');
  const subject = document.getElementById('taskSubjectInput');
  const date = document.getElementById('taskDueDateInput');
  const time = document.getElementById('taskDueTimeInput');
  const stepsContainer = document.getElementById('microStepsContainer');

  if (title) title.value = '';
  if (subject) subject.value = 'Cálculo Multivariable';
  if (date) date.value = new Date().toISOString().split('T')[0];
  if (time) time.value = '23:59';

  // Reiniciar selector de prioridad en formulario a 'high'
  window.selectFormPriority('high');

  if (stepsContainer) {
    stepsContainer.innerHTML = `
      <div class="flex items-center gap-2 micro-step-row">
        <input type="text" placeholder="Micro-paso 1 (ej. Revisar apuntes)" class="flex-1 text-xs px-3 py-2 rounded-lg bg-surface-container border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary text-on-surface">
        <button type="button" onclick="removeMicroStepRow(this)" class="p-1 text-slate-400 hover:text-red-500">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    `;
  }
}

window.addMicroStepRow = function () {
  const container = document.getElementById('microStepsContainer');
  if (!container) return;
  const count = container.querySelectorAll('.micro-step-row').length + 1;
  const div = document.createElement('div');
  div.className = 'flex items-center gap-2 micro-step-row animate-fade-in';
  div.innerHTML = `
    <input type="text" placeholder="Micro-paso ${count}" class="flex-1 text-xs px-3 py-2 rounded-lg bg-surface-container border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary text-on-surface">
    <button type="button" onclick="removeMicroStepRow(this)" class="p-1 text-slate-400 hover:text-red-500">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  `;
  container.appendChild(div);
};

window.removeMicroStepRow = function (btn) {
  const row = btn.closest('.micro-step-row');
  if (row) row.remove();
};

let selectedFormPriority = 'high';
window.selectFormPriority = function (prio) {
  selectedFormPriority = prio;
  document.querySelectorAll('[data-form-priority]').forEach(btn => {
    const isThis = btn.getAttribute('data-form-priority') === prio;
    if (isThis) {
      btn.classList.add('ring-2', 'ring-primary', 'font-bold');
    } else {
      btn.classList.remove('ring-2', 'ring-primary', 'font-bold');
    }
  });
};

let selectedDirectPriority = 'high';
window.selectDirectPriority = function (prio) {
  selectedDirectPriority = prio;
  document.querySelectorAll('[data-direct-priority]').forEach(btn => {
    const isThis = btn.getAttribute('data-direct-priority') === prio;
    if (isThis) {
      btn.classList.add('ring-2', 'ring-primary', 'font-bold');
    } else {
      btn.classList.remove('ring-2', 'ring-primary', 'font-bold');
    }
  });
};

window.addDirectMicroStepRow = function () {
  const container = document.getElementById('directMicroStepsContainer');
  if (!container) return;
  const count = container.querySelectorAll('.direct-micro-step-row').length + 1;
  const div = document.createElement('div');
  div.className = 'flex items-center gap-2 direct-micro-step-row animate-fade-in';
  div.innerHTML = `
    <input type="text" placeholder="Micro-paso ${count}" class="flex-1 text-xs px-3 py-2 rounded-lg bg-surface-container-low border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary text-on-surface">
    <button type="button" onclick="this.closest('.direct-micro-step-row').remove()" class="p-1 text-slate-400 hover:text-red-500">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  `;
  container.appendChild(div);
};

window.handleDirectTaskSubmit = function (e) {
  e.preventDefault();
  const title = document.getElementById('taskTitleInputDirect').value.trim();
  const subject = document.getElementById('taskSubjectInputDirect').value;
  const dueDate = document.getElementById('taskDueDateInputDirect').value;
  const dueTime = document.getElementById('taskDueTimeInputDirect').value || '23:59';

  if (!title) {
    showToast('Por favor escribe un título para la tarea', 'warning');
    return;
  }

  const microSteps = [];
  document.querySelectorAll('#directMicroStepsContainer input[type="text"]').forEach(input => {
    const txt = input.value.trim();
    if (txt) {
      microSteps.push({ text: txt, done: false });
    }
  });

  const newTask = {
    id: 'task-' + Date.now(),
    title,
    subject,
    dueDate,
    dueTime,
    priority: selectedDirectPriority,
    status: 'pending',
    estimatedMinutes: 45,
    microSteps,
    createdAt: new Date().toISOString()
  };

  AppState.tasks.unshift(newTask);
  saveTasks();
  
  // Limpiar formulario directo
  document.getElementById('taskTitleInputDirect').value = '';
  
  navigateTo('mi-dia');
  playChime('success');
  showToast('¡Tarea guardada y planificada!');
};

window.handleCreateTaskSubmit = function (e) {
  e.preventDefault();
  const title = document.getElementById('taskTitleInput').value.trim();
  const subject = document.getElementById('taskSubjectInput').value;
  const dueDate = document.getElementById('taskDueDateInput').value;
  const dueTime = document.getElementById('taskDueTimeInput').value || '23:59';
  const estimatedMin = parseInt(document.getElementById('taskEstimatedInput')?.value || '45', 10);

  if (!title) {
    showToast('Por favor escribe un título para la tarea', 'warning');
    return;
  }

  // Recolectar micro-pasos
  const microSteps = [];
  document.querySelectorAll('#microStepsContainer input[type="text"]').forEach(input => {
    const txt = input.value.trim();
    if (txt) {
      microSteps.push({ text: txt, done: false });
    }
  });

  const newTask = {
    id: 'task-' + Date.now(),
    title,
    subject,
    dueDate,
    dueTime,
    priority: selectedFormPriority,
    status: 'pending',
    estimatedMinutes: estimatedMin,
    microSteps,
    createdAt: new Date().toISOString()
  };

  AppState.tasks.unshift(newTask);
  saveTasks();
  closeNewTaskModal();
  renderActiveView();
  playChime('success');
  showToast('¡Tarea guardada exitosamente!');
};

window.toggleTaskStatus = function (taskId) {
  const task = AppState.tasks.find(t => t.id === taskId);
  if (!task) return;

  if (task.status === 'completed') {
    task.status = 'pending';
    showToast('Tarea marcada como pendiente');
  } else {
    task.status = 'completed';
    // Marcar todos los micro-pasos como listos
    if (task.microSteps) {
      task.microSteps.forEach(s => s.done = true);
    }
    playChime('success');
    triggerConfetti();
    showToast('¡Felicitaciones! Tarea completada 🎉');
  }

  saveTasks();
  renderActiveView();
};

window.changeTaskStatus = function (taskId, newStatus) {
  const task = AppState.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.status = newStatus;
  if (newStatus === 'completed') {
    if (task.microSteps) task.microSteps.forEach(s => s.done = true);
    playChime('success');
    triggerConfetti();
    showToast('¡Tarea completada con éxito!');
  } else {
    showToast(`Estado cambiado a: ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
  }
  saveTasks();
  renderActiveView();
};

window.toggleMicroStep = function (taskId, stepIndex) {
  const task = AppState.tasks.find(t => t.id === taskId);
  if (!task || !task.microSteps || !task.microSteps[stepIndex]) return;

  task.microSteps[stepIndex].done = !task.microSteps[stepIndex].done;

  // Si todos los micro-pasos se completaron, sugerir completar la tarea
  const allDone = task.microSteps.every(s => s.done);
  if (allDone && task.status !== 'completed') {
    task.status = 'completed';
    playChime('success');
    triggerConfetti();
    showToast('¡Todos los micro-pasos completados! Tarea lista.');
  }

  saveTasks();
  renderActiveView();
};

window.deleteTask = function (taskId) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
  AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
  saveTasks();
  renderActiveView();
  showToast('Tarea eliminada');
};

window.quickStartTask = function (taskId) {
  const task = AppState.tasks.find(t => t.id === taskId);
  if (!task) return;
  if (task.status === 'pending') {
    task.status = 'in_progress';
    saveTasks();
    renderActiveView();
  }
  // Cambiar a vista Mi Día si no está en ella
  navigateTo('mi-dia');
  // Iniciar pomodoro si no estaba corriendo
  if (!AppState.pomodoro.isRunning) {
    window.togglePomodoro();
  }
  showToast(`Enfocando en: ${task.title}`);
};

// ==========================================
// 11. MÉTRICAS Y ACTUALIZACIÓN GENERAL
// ==========================================

function updateMetrics() {
  const total = AppState.tasks.length;
  const completed = AppState.tasks.filter(t => t.status === 'completed').length;
  const pending = AppState.tasks.filter(t => t.status === 'pending').length;
  const inProgress = AppState.tasks.filter(t => t.status === 'in_progress').length;

  const effectiveness = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Métricas en la cabecera / tarjetas
  const effEl = document.getElementById('metricEffectiveness');
  if (effEl) effEl.textContent = `${effectiveness}%`;

  const pendingEl = document.getElementById('metricPending');
  if (pendingEl) pendingEl.textContent = pending;

  const inProgressEl = document.getElementById('metricInProgress');
  if (inProgressEl) inProgressEl.textContent = inProgress;

  const completedEl = document.getElementById('metricCompleted');
  if (completedEl) completedEl.textContent = completed;

  // Contador de tareas críticas (alta prioridad activas)
  const criticalCount = AppState.tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
  const criticalBadges = document.querySelectorAll('.critical-count-badge');
  criticalBadges.forEach(b => b.textContent = criticalCount);
}

// ==========================================
// 12. TOASTS Y UTILIDADES
// ==========================================

function showToast(message, type = 'success') {
  const toast = document.getElementById('appToast');
  const toastText = document.getElementById('appToastText');
  const toastIcon = document.getElementById('appToastIcon');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  if (toastIcon) {
    toastIcon.textContent = type === 'warning' ? 'warning' : 'check_circle';
    toastIcon.className = `material-symbols-outlined text-[18px] ${type === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`;
  }

  toast.classList.remove('hidden', 'opacity-0');
  toast.classList.add('flex', 'opacity-100');

  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 2800);
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Búsqueda y filtros globales
window.handleSearchInput = function (e) {
  AppState.searchQuery = e.target.value.trim();
  renderActiveView();
};

window.setPriorityFilter = function (prio) {
  AppState.filterPriority = prio;
  document.querySelectorAll('[data-prio-filter]').forEach(btn => {
    const isThis = btn.getAttribute('data-prio-filter') === prio;
    btn.className = isThis
      ? 'px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-on-primary shadow-sm'
      : 'px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high';
  });
  renderActiveView();
};

window.setSubjectFilter = function (subject) {
  AppState.filterSubject = subject;
  document.querySelectorAll('[data-subject-filter]').forEach(item => {
    const isThis = item.getAttribute('data-subject-filter') === subject;
    if (isThis) {
      item.classList.add('bg-primary/10', 'text-primary', 'font-bold');
    } else {
      item.classList.remove('bg-primary/10', 'text-primary', 'font-bold');
    }
  });
  renderActiveView();
};

window.resetAllData = function () {
  if (confirm('¿Restablecer datos a las tareas iniciales del semestre?')) {
    AppState.tasks = [...INITIAL_TASKS];
    saveTasks();
    renderActiveView();
    showToast('Datos de ejemplo restablecidos');
  }
};

// ==========================================
// 13. INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  loadUser();
  loadTasks();
  applyUserProfile();
  initPomodoro();
  navigateTo('mi-dia');
  checkOnboarding();

  // Enlazar eventos de navegación en sidebar
  document.querySelectorAll('[data-nav-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-nav-target');
      navigateTo(target);
    });
  });

  // Selector de prioridad por defecto en modal
  window.selectFormPriority('high');

  const directDate = document.getElementById('taskDueDateInputDirect');
  if (directDate) directDate.value = new Date().toISOString().split('T')[0];
});
