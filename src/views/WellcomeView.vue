<template>
  <div class="welcome">

    <!-- Header -->
    <div class="welcome-header">
      <div class="welcome-title-block">
        <span class="section-tag">// PANEL DE CONTROL OPERATIVO</span>
        <h1 class="welcome-heading">Bienvenido, <span class="accent">{{ userName }}</span></h1>
        <p class="welcome-sub">{{ currentDateTime }}</p>
      </div>
      <div class="header-actions">
        <button class="hdr-btn" @click="refreshData">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Actualizar
        </button>
        <button class="hdr-btn hdr-btn--primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar Reporte
        </button>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="stats-grid">
      <div class="stat-card stat-card--neutral">
        <div class="stat-icon-wrap stat-icon-wrap--blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        </div>
        <div class="stat-body">
          <span class="stat-value">30</span>
          <span class="stat-label">Unidades Totales</span>
        </div>
        <div class="stat-trend">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          <span>Flota completa</span>
        </div>
        <div class="stat-bar"><div class="stat-bar-fill stat-bar-fill--blue" style="width:100%"></div></div>
      </div>

      <div class="stat-card stat-card--green">
        <div class="stat-icon-wrap stat-icon-wrap--green">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="stat-body">
          <span class="stat-value">22</span>
          <span class="stat-label">Operativas</span>
        </div>
        <div class="stat-trend stat-trend--green">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          <span>73% disponibles</span>
        </div>
        <div class="stat-bar"><div class="stat-bar-fill stat-bar-fill--green" style="width:73%"></div></div>
      </div>

      <div class="stat-card stat-card--orange">
        <div class="stat-icon-wrap stat-icon-wrap--orange">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <div class="stat-body">
          <span class="stat-value">5</span>
          <span class="stat-label">En Taller</span>
        </div>
        <div class="stat-trend stat-trend--orange">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          <span>17% en mantenimiento</span>
        </div>
        <div class="stat-bar"><div class="stat-bar-fill stat-bar-fill--orange" style="width:17%"></div></div>
      </div>

      <div class="stat-card stat-card--red">
        <div class="stat-icon-wrap stat-icon-wrap--red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div class="stat-body">
          <span class="stat-value">3</span>
          <span class="stat-label">Inoperativas</span>
        </div>
        <div class="stat-trend stat-trend--red">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          <span>Requieren atención</span>
        </div>
        <div class="stat-bar"><div class="stat-bar-fill stat-bar-fill--red" style="width:10%"></div></div>
      </div>
    </div>

    <!-- Charts / KPIs -->
    <DashboardCharts />

    <!-- Bottom: calendar + quick access + activity -->
    <div class="bottom-grid">
      <!-- Calendar -->
      <div class="calendar-panel">
        <span class="section-tag">// CALENDARIO DE GUARDIAS</span>
        <div class="calendar-header">
          <button class="cal-nav" @click="prevMonth">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span class="cal-title">{{ calendarTitle }}</span>
          <button class="cal-nav" @click="nextMonth">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div class="calendar-grid">
          <div class="cal-weekday" v-for="d in ['LUN','MAR','MIE','JUE','VIE','SAB','DOM']" :key="d">{{ d }}</div>
          <div 
            v-for="(day, idx) in calendarDays" 
            :key="idx"
            :class="['cal-day', day.class, { 'cal-day--today': day.isToday, 'cal-day--other': !day.currentMonth }]"
            @click="day.currentMonth && selectDay(day)"
          >
            <span class="cal-day-num">{{ day.day }}</span>
            <span v-if="day.guard && day.currentMonth" :class="['cal-guard', `cal-guard--${day.guard.toLowerCase()}`]">{{ day.guard }}</span>
          </div>
        </div>
        <div class="calendar-legend">
          <div class="legend-item"><span class="legend-dot legend-dot--a"></span>Guardia A</div>
          <div class="legend-item"><span class="legend-dot legend-dot--b"></span>Guardia B</div>
          <div class="legend-item"><span class="legend-dot legend-dot--c"></span>Guardia C</div>
          <div class="legend-item"><span class="legend-dot legend-dot--d"></span>Guardia D</div>
        </div>
      </div>

      <!-- Quick access -->
      <div class="quick-access">
        <span class="section-tag">// ACCESO RAPIDO</span>
        <div class="quick-grid">
          <router-link to="/typeToVehicles" class="quick-card">
            <div class="quick-icon-wrap quick-icon-wrap--red">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div class="quick-body">
              <span class="quick-title">Gestión de Vehículos</span>
              <span class="quick-desc">Consultar, monitorear y registrar unidades por tipo</span>
            </div>
            <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </router-link>

          <router-link to="/stateforce" class="quick-card">
            <div class="quick-icon-wrap quick-icon-wrap--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="quick-body">
              <span class="quick-title">Estado de Fuerza</span>
              <span class="quick-desc">Personal activo, guardias y asignaciones de turno</span>
            </div>
            <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </router-link>

          <router-link to="/tools" class="quick-card">
            <div class="quick-icon-wrap quick-icon-wrap--amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="6" height="4"/><rect x="9" y="3" width="6" height="8"/><rect x="16" y="3" width="6" height="6"/><rect x="2" y="10" width="6" height="8"/><rect x="9" y="14" width="6" height="7"/><rect x="16" y="12" width="6" height="9"/></svg>
            </div>
            <div class="quick-body">
              <span class="quick-title">Reportes y Herramientas</span>
              <span class="quick-desc">Exportación de datos y utilidades del sistema</span>
            </div>
            <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </router-link>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="activity-panel">
        <span class="section-tag">// ACTIVIDAD RECIENTE</span>
        <div class="activity-list">
          <div v-for="item in recentActivity" :key="item.id" class="activity-item">
            <div :class="['activity-dot', `activity-dot--${item.type}`]"></div>
            <div class="activity-content">
              <span class="activity-text">{{ item.text }}</span>
              <span class="activity-time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import DashboardCharts from '@/components/common/DashboardCharts.vue'

export default {
  name: 'WellcomeView',
  components: { DashboardCharts },
  data() {
    return {
      userName: 'Salomon Molina',
      currentDateTime: '',
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      recentActivity: [
        { id: 1, type: 'green', text: 'U-37 marcada como Operativa', time: 'Hace 5 min' },
        { id: 2, type: 'orange', text: 'U-78 enviada a taller - Motor', time: 'Hace 22 min' },
        { id: 3, type: 'blue', text: 'Bitacora de recepcion completada - U-37', time: 'Hace 1h' },
        { id: 4, type: 'red', text: 'U-12 marcada inoperativa - Revision', time: 'Hace 3h' },
        { id: 5, type: 'blue', text: 'Incidente #4568 cerrado - Guardia A', time: 'Hace 5h' },
      ]
    }
  },
  computed: {
    calendarTitle() {
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return `${months[this.currentMonth]} ${this.currentYear}`;
    },
    calendarDays() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const today = new Date();
      
      // Get day of week (0=Sun, adjust to Mon=0)
      let startDay = firstDay.getDay() - 1;
      if (startDay < 0) startDay = 6;
      
      // Previous month days
      const prevMonthLast = new Date(this.currentYear, this.currentMonth, 0).getDate();
      for (let i = startDay - 1; i >= 0; i--) {
        const d = prevMonthLast - i;
        days.push({ day: d, currentMonth: false, guard: this.getGuard(this.currentYear, this.currentMonth - 1, d) });
      }
      
      // Current month days
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const isToday = d === today.getDate() && this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
        days.push({ day: d, currentMonth: true, isToday, guard: this.getGuard(this.currentYear, this.currentMonth, d) });
      }
      
      // Next month days to fill 6 rows
      const remaining = 42 - days.length;
      for (let d = 1; d <= remaining; d++) {
        days.push({ day: d, currentMonth: false, guard: this.getGuard(this.currentYear, this.currentMonth + 1, d) });
      }
      
      return days;
    }
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 60000);
  },
  methods: {
    updateTime() {
      this.currentDateTime = new Date().toLocaleDateString('es-MX', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    },
    refreshData() {
      // TODO: connect to API
    },
    getGuard(year, month, day) {
      // 4-day rotation cycle: A, B, C, D starting from a reference date
      const refDate = new Date(2026, 0, 1); // Jan 1, 2026 = Guard A
      const targetDate = new Date(year, month, day);
      const diffDays = Math.floor((targetDate - refDate) / (1000 * 60 * 60 * 24));
      const guards = ['A', 'B', 'C', 'D'];
      return guards[((diffDays % 4) + 4) % 4];
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    selectDay(day) {
      console.log('[ITSIO] Selected day:', day);
    }
  }
}
</script>

<style scoped>
.welcome {
  padding-top: 20px;
  display: flex; flex-direction: column;
  gap: 20px;
  height: 100%; overflow-y: auto;
}

.welcome-header {
  display: flex; align-items: flex-end;
  justify-content: space-between; gap: 16px;
  flex-shrink: 0;
}
.welcome-title-block { display: flex; flex-direction: column; }
.welcome-heading {
  font-family: var(--font-display);
  font-size: 2rem; font-weight: 700;
  margin: 0 0 4px; color: var(--text-primary);
  letter-spacing: 0.04em;
}
.accent { color: var(--accent-secondary); }
.welcome-sub {
  font-family: var(--font-mono);
  font-size: 0.7rem; color: var(--text-muted);
  margin: 0; text-transform: capitalize; letter-spacing: 0.05em;
}

.header-actions { display: flex; gap: 8px; align-items: center; }
.hdr-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  font-family: var(--font-display);
  font-size: 0.8rem; font-weight: 600;
  letter-spacing: 0.06em;
  border-radius: var(--radius);
  border: 1px solid var(--border-subtle);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer; transition: all 0.2s;
}
.hdr-btn:hover { border-color: var(--border-accent); color: var(--text-primary); }
.hdr-btn--primary { background: rgba(220,38,38,0.1); border-color: rgba(220,38,38,0.3); color: var(--accent-secondary); }
.hdr-btn--primary:hover { background: rgba(220,38,38,0.18); }

/* Stats grid */
.stats-grid {
  display: grid; grid-template-columns: repeat(4,1fr);
  gap: 12px; flex-shrink: 0;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 18px 16px 14px;
  display: flex; flex-direction: column; gap: 10px;
  position: relative; overflow: hidden;
  transition: border-color 0.2s;
}
.stat-card:hover { border-color: var(--border-accent); }
.stat-card--green { border-left: 3px solid var(--accent-green); }
.stat-card--orange { border-left: 3px solid var(--accent-orange); }
.stat-card--red { border-left: 3px solid var(--accent-red); }
.stat-card--neutral { border-left: 3px solid var(--accent-blue); }

.stat-icon-wrap {
  width: 40px; height: 40px; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-icon-wrap--green { background: var(--accent-green-glow); color: var(--accent-green); border: 1px solid rgba(34,197,94,0.2); }
.stat-icon-wrap--orange { background: var(--accent-orange-glow); color: var(--accent-orange); border: 1px solid rgba(249,115,22,0.2); }
.stat-icon-wrap--red { background: rgba(239,68,68,0.1); color: var(--accent-red); border: 1px solid rgba(239,68,68,0.2); }
.stat-icon-wrap--blue { background: rgba(59,130,246,0.1); color: var(--accent-blue); border: 1px solid rgba(59,130,246,0.2); }

.stat-body { display: flex; flex-direction: column; }
.stat-value {
  font-family: var(--font-display);
  font-size: 2rem; font-weight: 700;
  color: var(--text-primary); line-height: 1;
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 0.6rem; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.12em; margin-top: 4px;
}

.stat-trend {
  display: flex; align-items: center; gap: 5px;
  font-family: var(--font-mono); font-size: 0.6rem;
  color: var(--text-muted); letter-spacing: 0.05em;
}
.stat-trend--green { color: var(--accent-green); }
.stat-trend--orange { color: var(--accent-orange); }
.stat-trend--red { color: var(--accent-red); }

.stat-bar { height: 3px; background: var(--border-subtle); border-radius: 2px; margin-top: auto; }
.stat-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s ease; }
.stat-bar-fill--green { background: var(--accent-green); }
.stat-bar-fill--orange { background: var(--accent-orange); }
.stat-bar-fill--red { background: var(--accent-red); }
.stat-bar-fill--blue { background: var(--accent-blue); }

/* Bottom layout */
.bottom-grid {
  display: grid; grid-template-columns: 380px 1fr 280px; gap: 16px;
  flex: 1; min-height: 0;
}

/* Calendar */
.calendar-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 18px;
  display: flex; flex-direction: column; gap: 14px;
  overflow: hidden;
}

.calendar-header {
  display: flex; align-items: center; justify-content: space-between;
}

.cal-nav {
  background: none; border: none; color: var(--text-secondary);
  cursor: pointer; padding: 6px; display: flex;
  transition: color 0.2s;
}
.cal-nav:hover { color: var(--accent-secondary); }

.cal-title {
  font-family: var(--font-display);
  font-size: 1.1rem; font-weight: 700;
  color: var(--text-primary);
}

.calendar-grid {
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.cal-weekday {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-align: center;
  padding: 6px 0;
  letter-spacing: 0.1em;
}

.cal-day {
  aspect-ratio: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 2px;
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}
.cal-day:hover { background: var(--bg-card-hover); }
.cal-day--today {
  background: rgba(220,38,38,0.15);
  border: 1px solid var(--accent-secondary);
}
.cal-day--other { opacity: 0.3; }

.cal-day-num {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-primary);
}

.cal-guard {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 3px;
  letter-spacing: 0.05em;
}
.cal-guard--a { background: rgba(59,130,246,0.2); color: var(--accent-blue); }
.cal-guard--b { background: rgba(34,197,94,0.2); color: var(--accent-green); }
.cal-guard--c { background: rgba(245,158,11,0.2); color: var(--accent-amber); }
.cal-guard--d { background: rgba(168,85,247,0.2); color: #a855f7; }

.calendar-legend {
  display: flex; justify-content: center; gap: 14px;
  padding-top: 10px; border-top: 1px solid var(--border-subtle);
}

.legend-item {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.legend-dot {
  width: 8px; height: 8px; border-radius: 50%;
}
.legend-dot--a { background: var(--accent-blue); }
.legend-dot--b { background: var(--accent-green); }
.legend-dot--c { background: var(--accent-amber); }
.legend-dot--d { background: #a855f7; }

/* Quick access */
.quick-access { display: flex; flex-direction: column; gap: 10px; }
.quick-grid { display: flex; flex-direction: column; gap: 8px; }

.quick-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative; overflow: hidden;
}
.quick-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
  transform: scaleX(0); transition: transform 0.3s;
}
.quick-card:hover { border-color: var(--border-accent); background: var(--bg-card-hover); transform: translateX(3px); }
.quick-card:hover::before { transform: scaleX(1); }

.quick-icon-wrap {
  width: 44px; height: 44px; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.quick-icon-wrap--red { background: rgba(220,38,38,0.1); color: var(--accent-secondary); border: 1px solid rgba(220,38,38,0.2); }
.quick-icon-wrap--blue { background: rgba(59,130,246,0.1); color: var(--accent-blue); border: 1px solid rgba(59,130,246,0.2); }
.quick-icon-wrap--amber { background: rgba(245,158,11,0.1); color: var(--accent-amber); border: 1px solid rgba(245,158,11,0.2); }

.quick-body { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.quick-title {
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  color: var(--text-primary); letter-spacing: 0.04em;
}
.quick-desc { font-family: var(--font-body); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3; }

.quick-arrow { color: var(--text-muted); transition: transform 0.2s, color 0.2s; flex-shrink: 0; }
.quick-card:hover .quick-arrow { transform: translateX(4px); color: var(--accent-secondary); }

/* Activity panel */
.activity-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex; flex-direction: column; gap: 10px;
  overflow-y: auto;
}

.activity-list { display: flex; flex-direction: column; gap: 2px; }

.activity-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius);
  transition: background 0.2s;
}
.activity-item:hover { background: var(--bg-card-hover); }

.activity-dot {
  width: 8px; height: 8px; border-radius: 50%;
  flex-shrink: 0; margin-top: 4px;
}
.activity-dot--green { background: var(--accent-green); box-shadow: 0 0 6px rgba(34,197,94,0.5); }
.activity-dot--orange { background: var(--accent-orange); box-shadow: 0 0 6px rgba(249,115,22,0.5); }
.activity-dot--red { background: var(--accent-red); box-shadow: 0 0 6px rgba(239,68,68,0.5); }
.activity-dot--blue { background: var(--accent-blue); box-shadow: 0 0 6px rgba(59,130,246,0.5); }

.activity-content { display: flex; flex-direction: column; gap: 2px; }
.activity-text { font-family: var(--font-body); font-size: 0.78rem; color: var(--text-secondary); line-height: 1.3; }
.activity-time { font-family: var(--font-mono); font-size: 0.58rem; color: var(--text-muted); letter-spacing: 0.05em; }
</style>
