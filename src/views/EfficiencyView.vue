<template>
  <div class="efficiency-view">
    <div class="view-header">
      <div>
        <span class="section-tag">// METRICAS DE RENDIMIENTO</span>
        <h2 class="view-title">Eficiencia de Personal</h2>
      </div>
      <div class="header-actions">
        <select v-model="selectedPeriod" class="period-select">
          <option value="week">Esta Semana</option>
          <option value="month">Este Mes</option>
          <option value="quarter">Trimestre</option>
          <option value="year">Este Anio</option>
        </select>
        <select v-model="selectedGuard" class="guard-select">
          <option value="all">Todas las Guardias</option>
          <option value="A">Guardia A</option>
          <option value="B">Guardia B</option>
          <option value="C">Guardia C</option>
          <option value="D">Guardia D</option>
        </select>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon stat-icon--blue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ avgResponseTime }}<small>min</small></span>
          <span class="stat-label">Tiempo Promedio de Respuesta</span>
        </div>
        <div :class="['stat-trend', responseTimeTrend > 0 ? 'stat-trend--bad' : 'stat-trend--good']">
          <svg v-if="responseTimeTrend <= 0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg>
          <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          {{ Math.abs(responseTimeTrend) }}% vs periodo anterior
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon--green">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalIncidents }}</span>
          <span class="stat-label">Incidentes Atendidos</span>
        </div>
        <div class="stat-trend stat-trend--good">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          +12% vs periodo anterior
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon--amber">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ avgEffectiveness }}<small>%</small></span>
          <span class="stat-label">Efectividad Promedio</span>
        </div>
        <div class="stat-trend stat-trend--good">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          +5% vs periodo anterior
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon--red">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ avgTimeOutside }}<small>min</small></span>
          <span class="stat-label">Tiempo Promedio Fuera</span>
        </div>
        <div class="stat-subtext">Por tipo de incidente</div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-grid">
      <!-- Personnel Rankings -->
      <div class="rankings-panel">
        <div class="panel-header">
          <span class="panel-title">Ranking de Personal</span>
          <select v-model="rankingMetric" class="metric-select">
            <option value="effectiveness">Por Efectividad</option>
            <option value="responseTime">Por Tiempo Respuesta</option>
            <option value="incidents">Por Incidentes</option>
          </select>
        </div>
        <div class="rankings-list">
          <div v-for="(person, idx) in rankedPersonnel" :key="person.id" class="ranking-item">
            <span class="ranking-pos" :class="{ 'ranking-pos--top': idx < 3 }">{{ idx + 1 }}</span>
            <div class="ranking-avatar" :style="{ background: person.avatarColor }">
              {{ person.initials }}
            </div>
            <div class="ranking-info">
              <span class="ranking-name">{{ person.name }}</span>
              <span class="ranking-meta">{{ person.rank }} - Guardia {{ person.guard }}</span>
            </div>
            <div class="ranking-stats">
              <div class="rs-item">
                <span class="rs-value">{{ person.responseTime }}m</span>
                <span class="rs-label">T. Resp.</span>
              </div>
              <div class="rs-item">
                <span class="rs-value">{{ person.incidents }}</span>
                <span class="rs-label">Inc.</span>
              </div>
              <div class="rs-item">
                <span class="rs-value" :class="getEffectivenessClass(person.effectiveness)">{{ person.effectiveness }}%</span>
                <span class="rs-label">Efect.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Response Time by Incident Type -->
      <div class="chart-panel">
        <div class="panel-header">
          <span class="panel-title">Tiempo de Respuesta por Tipo de Incidente</span>
        </div>
        <div class="chart-content">
          <div v-for="type in incidentTypes" :key="type.id" class="chart-bar-row">
            <span class="chart-label">{{ type.name }}</span>
            <div class="chart-bar-wrap">
              <div class="chart-bar" :style="{ width: (type.avgTime / maxResponseTime * 100) + '%', background: type.color }"></div>
              <span class="chart-value">{{ type.avgTime }} min</span>
            </div>
            <span class="chart-benchmark" :class="type.avgTime <= type.benchmark ? 'chart-benchmark--good' : 'chart-benchmark--bad'">
              Meta: {{ type.benchmark }}m
            </span>
          </div>
        </div>

        <!-- Average Time Outside by Incident -->
        <div class="panel-header" style="margin-top: 20px;">
          <span class="panel-title">Tiempo Promedio Fuera de Estacion</span>
        </div>
        <div class="time-grid">
          <div v-for="type in incidentTypes" :key="type.id + '-time'" class="time-card">
            <span class="time-type">{{ type.shortName }}</span>
            <span class="time-value">{{ type.avgTimeOutside }}</span>
            <span class="time-unit">minutos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Guard Comparison -->
    <div class="guard-comparison">
      <div class="panel-header">
        <span class="panel-title">Comparativa por Guardia</span>
      </div>
      <div class="guard-grid">
        <div v-for="guard in guardStats" :key="guard.id" class="guard-card">
          <div class="guard-header">
            <span :class="['guard-badge', `guard-badge--${guard.id.toLowerCase()}`]">GUARDIA {{ guard.id }}</span>
            <span class="guard-personnel">{{ guard.personnel }} elementos</span>
          </div>
          <div class="guard-stats">
            <div class="gs-item">
              <span class="gs-label">Tiempo Respuesta</span>
              <span class="gs-value">{{ guard.responseTime }} min</span>
            </div>
            <div class="gs-item">
              <span class="gs-label">Incidentes</span>
              <span class="gs-value">{{ guard.incidents }}</span>
            </div>
            <div class="gs-item">
              <span class="gs-label">Efectividad</span>
              <span :class="['gs-value', getEffectivenessClass(guard.effectiveness)]">{{ guard.effectiveness }}%</span>
            </div>
          </div>
          <div class="guard-bar">
            <div class="guard-bar-fill" :style="{ width: guard.effectiveness + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EfficiencyView',
  data() {
    return {
      selectedPeriod: 'month',
      selectedGuard: 'all',
      rankingMetric: 'effectiveness',
      avgResponseTime: 4.2,
      responseTimeTrend: -8,
      totalIncidents: 147,
      avgEffectiveness: 92,
      avgTimeOutside: 45,
      maxResponseTime: 12,
      personnel: [
        { id: 1, name: 'Cap. Jorge Garcia', rank: 'Capitan', guard: 'A', initials: 'JG', avatarColor: '#dc2626', responseTime: 3.8, incidents: 42, effectiveness: 96 },
        { id: 2, name: 'Tte. Roberto Sanchez', rank: 'Teniente', guard: 'A', initials: 'RS', avatarColor: '#2563eb', responseTime: 4.1, incidents: 38, effectiveness: 94 },
        { id: 3, name: 'Bro. Carlos Mendez', rank: 'Bombero', guard: 'B', initials: 'CM', avatarColor: '#16a34a', responseTime: 4.5, incidents: 35, effectiveness: 91 },
        { id: 4, name: 'Bro. Luis Hernandez', rank: 'Bombero', guard: 'B', initials: 'LH', avatarColor: '#9333ea', responseTime: 4.8, incidents: 32, effectiveness: 88 },
        { id: 5, name: 'Bro. Pedro Ramirez', rank: 'Bombero', guard: 'C', initials: 'PR', avatarColor: '#ea580c', responseTime: 4.0, incidents: 40, effectiveness: 93 },
        { id: 6, name: 'Bro. Ana Lopez', rank: 'Bombero', guard: 'C', initials: 'AL', avatarColor: '#0891b2', responseTime: 4.3, incidents: 36, effectiveness: 90 },
        { id: 7, name: 'Bro. Miguel Torres', rank: 'Bombero', guard: 'D', initials: 'MT', avatarColor: '#4f46e5', responseTime: 5.1, incidents: 28, effectiveness: 85 },
        { id: 8, name: 'Bro. Sofia Ruiz', rank: 'Bombero', guard: 'D', initials: 'SR', avatarColor: '#be185d', responseTime: 4.9, incidents: 30, effectiveness: 87 }
      ],
      incidentTypes: [
        { id: 1, name: 'Incendio Estructural', shortName: 'Estructural', avgTime: 4.5, benchmark: 5, avgTimeOutside: 95, color: '#dc2626' },
        { id: 2, name: 'Incendio Vehicular', shortName: 'Vehicular', avgTime: 3.8, benchmark: 4, avgTimeOutside: 45, color: '#f97316' },
        { id: 3, name: 'Rescate Vehicular', shortName: 'Rescate Veh.', avgTime: 5.2, benchmark: 5, avgTimeOutside: 65, color: '#eab308' },
        { id: 4, name: 'Atencion Pre-hospitalaria', shortName: 'APH', avgTime: 3.2, benchmark: 4, avgTimeOutside: 35, color: '#22c55e' },
        { id: 5, name: 'Fuga de Gas', shortName: 'Fuga Gas', avgTime: 4.0, benchmark: 5, avgTimeOutside: 40, color: '#3b82f6' },
        { id: 6, name: 'Materiales Peligrosos', shortName: 'HAZMAT', avgTime: 6.5, benchmark: 8, avgTimeOutside: 120, color: '#a855f7' },
      ],
      guardStats: [
        { id: 'A', personnel: 12, responseTime: 3.9, incidents: 45, effectiveness: 95 },
        { id: 'B', personnel: 11, responseTime: 4.6, incidents: 38, effectiveness: 89 },
        { id: 'C', personnel: 12, responseTime: 4.2, incidents: 42, effectiveness: 92 },
        { id: 'D', personnel: 10, responseTime: 5.0, incidents: 32, effectiveness: 86 },
      ]
    }
  },
  computed: {
    rankedPersonnel() {
      const sorted = [...this.personnel]
      if (this.rankingMetric === 'effectiveness') {
        sorted.sort((a, b) => b.effectiveness - a.effectiveness)
      } else if (this.rankingMetric === 'responseTime') {
        sorted.sort((a, b) => a.responseTime - b.responseTime)
      } else {
        sorted.sort((a, b) => b.incidents - a.incidents)
      }
      return this.selectedGuard === 'all' 
        ? sorted 
        : sorted.filter(p => p.guard === this.selectedGuard)
    }
  },
  methods: {
    getEffectivenessClass(value) {
      if (value >= 90) return 'eff--high'
      if (value >= 80) return 'eff--mid'
      return 'eff--low'
    }
  }
}
</script>

<style scoped>
.efficiency-view { padding-top: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
.view-header { display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
.view-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--text-primary); letter-spacing: 0.06em; }

.header-actions { display: flex; gap: 8px; }
.period-select, .guard-select {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 6px 12px;
  font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary);
  cursor: pointer; outline: none;
}
.period-select:focus, .guard-select:focus { border-color: var(--accent-secondary); }

/* Stats Row */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; flex-shrink: 0; }

.stat-card {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); padding: 14px;
  display: flex; flex-direction: column; gap: 8px;
}

.stat-icon {
  width: 36px; height: 36px; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
}
.stat-icon--blue { background: rgba(59,130,246,0.1); color: var(--accent-blue); }
.stat-icon--green { background: var(--accent-green-glow); color: var(--accent-green); }
.stat-icon--amber { background: rgba(245,158,11,0.1); color: var(--accent-amber); }
.stat-icon--red { background: rgba(220,38,38,0.1); color: var(--accent-secondary); }

.stat-info { display: flex; flex-direction: column; }
.stat-value { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--text-primary); line-height: 1; }
.stat-value small { font-size: 0.9rem; color: var(--text-muted); margin-left: 2px; }
.stat-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.08em; margin-top: 2px; }

.stat-trend {
  display: flex; align-items: center; gap: 4px;
  font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.05em;
}
.stat-trend--good { color: var(--accent-green); }
.stat-trend--bad { color: var(--accent-red); }
.stat-subtext { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-muted); }

/* Content Grid */
.content-grid { display: grid; grid-template-columns: 380px 1fr; gap: 16px; flex: 1; min-height: 0; }

/* Rankings Panel */
.rankings-panel, .chart-panel {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden;
}

.panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-bottom: 1px solid var(--border-subtle);
}
.panel-title { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }

.metric-select {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 4px 8px;
  font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-secondary);
  cursor: pointer; outline: none;
}

.rankings-list { flex: 1; overflow-y: auto; padding: 8px; }

.ranking-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px; border-radius: var(--radius);
  transition: background 0.2s;
}
.ranking-item:hover { background: var(--bg-card-hover); }

.ranking-pos {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--bg-secondary); color: var(--text-muted);
  font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.ranking-pos--top { background: rgba(245,158,11,0.15); color: var(--accent-amber); }

.ranking-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 0.7rem; font-weight: 700; color: white;
}

.ranking-info { flex: 1; display: flex; flex-direction: column; }
.ranking-name { font-family: var(--font-display); font-size: 0.8rem; font-weight: 600; color: var(--text-primary); }
.ranking-meta { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-muted); }

.ranking-stats { display: flex; gap: 12px; }
.rs-item { display: flex; flex-direction: column; align-items: center; }
.rs-value { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--text-primary); }
.rs-label { font-family: var(--font-mono); font-size: 0.45rem; color: var(--text-muted); letter-spacing: 0.05em; }

.eff--high { color: var(--accent-green) !important; }
.eff--mid { color: var(--accent-amber) !important; }
.eff--low { color: var(--accent-red) !important; }

/* Chart Panel */
.chart-content { padding: 16px; display: flex; flex-direction: column; gap: 12px; }

.chart-bar-row { display: flex; align-items: center; gap: 10px; }
.chart-label { font-family: var(--font-body); font-size: 0.75rem; color: var(--text-secondary); width: 160px; flex-shrink: 0; }
.chart-bar-wrap { flex: 1; display: flex; align-items: center; gap: 8px; }
.chart-bar { height: 20px; border-radius: 3px; transition: width 0.5s ease; }
.chart-value { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-primary); width: 50px; }
.chart-benchmark { font-family: var(--font-mono); font-size: 0.55rem; width: 60px; text-align: right; }
.chart-benchmark--good { color: var(--accent-green); }
.chart-benchmark--bad { color: var(--accent-red); }

/* Time Grid */
.time-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; padding: 12px 16px; }
.time-card {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 10px;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.time-type { font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-muted); letter-spacing: 0.05em; text-align: center; }
.time-value { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--text-primary); }
.time-unit { font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-muted); }

/* Guard Comparison */
.guard-comparison {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); flex-shrink: 0;
}

.guard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 16px; }

.guard-card {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 14px;
}

.guard-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.guard-badge {
  font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.15em; padding: 3px 8px; border-radius: 2px;
}
.guard-badge--a { background: rgba(59,130,246,0.15); color: var(--accent-blue); }
.guard-badge--b { background: var(--accent-green-glow); color: var(--accent-green); }
.guard-badge--c { background: rgba(245,158,11,0.15); color: var(--accent-amber); }
.guard-badge--d { background: rgba(168,85,247,0.15); color: #a855f7; }
.guard-personnel { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-muted); }

.guard-stats { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.gs-item { display: flex; justify-content: space-between; }
.gs-label { font-family: var(--font-mono); font-size: 0.58rem; color: var(--text-muted); }
.gs-value { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: var(--text-primary); }

.guard-bar { height: 4px; background: var(--bg-card); border-radius: 2px; overflow: hidden; }
.guard-bar-fill { height: 100%; background: var(--accent-green); transition: width 0.5s ease; }
</style>
