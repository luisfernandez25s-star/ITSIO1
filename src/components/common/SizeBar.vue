<template>
  <div class="size-bar">
    <router-link
      v-for="item in navItems"
      :key="item.route"
      :to="item.route === 'wellcome' ? '/' : `/${item.route}`"
      class="nav-link"
      active-class="nav-link--active"
    >
      <span class="nav-icon" v-html="item.icon"></span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>

    <div class="bar-spacer"></div>

    <!-- Shift selector -->
    <div class="shift-selector">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <select class="shift-select" v-model="selectedShift">
        <option value="A">GUARDIA A</option>
        <option value="B">GUARDIA B</option>
        <option value="C">GUARDIA C</option>
        <option value="D">GUARDIA D</option>
      </select>
    </div>

    <!-- Clock -->
    <div class="size-bar-time">
      <span class="time-display">{{ currentTime }}</span>
      <span class="date-display">{{ currentDate }}</span>
    </div>
  </div>
</template>

<script>
import { getSession, canAccess } from '@/utils/usersMock.js'

export default {
  name: 'SizeBar',
  data() {
    return {
      selectedShift: 'A',
      currentTime: '',
      currentDate: '',
      timer: null,
      allNavItems: [
        {
          route: 'wellcome',
          label: 'Inicio',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
        },
        {
          route: 'analytics',
          label: 'Dashboard',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
        },
        {
          route: 'data-studio',
          label: 'Data Studio',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></svg>`
        },
        {
          route: 'dispatch',
          label: 'Despacho',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
        },
        {
          route: 'incidents',
          label: 'Incidentes',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
        },
        {
          route: 'stateforce',
          label: 'Fuerza',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        },
        {
          route: 'typeToVehicles',
          label: 'Flota',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
        },
        {
          route: 'fleet-analytics',
          label: 'Combustible',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`
        },
        {
          route: 'tools',
          label: 'Equipo',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`
        },
        {
          route: 'training',
          label: 'Capacitacion',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
        },
        {
          route: 'reports',
          label: 'Reportes',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
        },
        {
          route: 'efficiency',
          label: 'Eficiencia',
          icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>`
        }
      ]
    }
  },
  computed: {
    // Solo muestra las secciones permitidas para el rango del usuario.
    navItems() {
      const session = getSession()
      const roleKey = (session && session.roleKey) || 'bombero'
      return this.allNavItems.filter(item => canAccess(roleKey, item.route))
    }
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeUnmount() { clearInterval(this.timer); },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.currentDate = now.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
}
</script>

<style scoped>
.size-bar {
  width: 100%;
  height: 48px;
  background: #18181a;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 2px;
  flex-shrink: 0;
}

.nav-link {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 14px;
  text-decoration: none;
  color: var(--text-muted);
  font-family: var(--font-display);
  font-size: 0.82rem; font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: var(--radius);
  transition: all var(--transition);
  border: 1px solid transparent;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 20%; right: 20%;
  height: 2px;
  background: var(--accent-primary);
  transform: scaleX(0);
  transition: transform 0.2s ease;
  border-radius: 1px;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-card);
  border-color: var(--border-subtle);
}
.nav-link:hover::after { transform: scaleX(1); }

.nav-link--active {
  color: var(--accent-secondary) !important;
  background: rgba(220,38,38,0.08) !important;
  border-color: rgba(220,38,38,0.2) !important;
}
.nav-link--active::after { transform: scaleX(1); }

.nav-icon {
  display: flex; align-items: center;
  opacity: 0.6;
  transition: opacity 0.2s;
  flex-shrink: 0;
}
.nav-link:hover .nav-icon,
.nav-link--active .nav-icon { opacity: 1; }

.nav-label { white-space: nowrap; }
.bar-spacer { flex: 1; }

/* Shift selector */
.shift-selector {
  display: flex; align-items: center; gap: 7px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  margin-right: 16px;
}

.shift-select {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  padding: 4px 8px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.shift-select:hover, .shift-select:focus { border-color: var(--border-accent); color: var(--accent-secondary); }

/* Clock */
.size-bar-time {
  display: flex; flex-direction: column; align-items: flex-end;
  padding-left: 16px;
  border-left: 1px solid var(--border-subtle);
}
.time-display {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--accent-secondary);
  letter-spacing: 0.1em;
}
.date-display {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Android TV / Large Screens */
@media (min-width: 1920px) {
  .size-bar {
    height: 64px;
    padding: 0 48px;
    gap: 4px;
  }
  
  .nav-link {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
  
  .nav-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .shift-select {
    font-size: 0.75rem;
    padding: 6px 12px;
  }
  
  .time-display {
    font-size: 1.1rem;
  }
  
  .date-display {
    font-size: 0.7rem;
  }
}

/* TV Focus states */
.tv-mode .nav-link:focus {
  outline: 3px solid var(--accent-secondary);
  outline-offset: 2px;
  background: rgba(220,38,38,0.15);
}

.tv-mode .shift-select:focus {
  outline: 3px solid var(--accent-secondary);
  outline-offset: 2px;
}
</style>
