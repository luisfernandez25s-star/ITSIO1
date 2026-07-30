<template>
  <div class="datastudio-view">
    <!-- Header -->
    <header class="view-header">
      <div class="header-content">
        <span class="section-tag">// ITSIO · ANÁLISIS DE DATOS</span>
        <h1 class="view-title">Data Studio</h1>
        <p class="view-desc">Diagramas y estadísticas operativas de la estación</p>
      </div>
      <div class="header-actions">
        <select v-model="period" class="period-select">
          <option value="year">Este año</option>
          <option value="quarter">Último trimestre</option>
          <option value="month">Último mes</option>
        </select>
      </div>
    </header>

    <!-- KPIs -->
    <section class="kpi-grid" aria-label="Indicadores clave">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card">
        <span class="kpi-label">{{ kpi.label }}</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ kpi.value }}</span>
          <span class="kpi-trend" :class="kpi.trend >= 0 ? 'up' : 'down'">
            {{ kpi.trend >= 0 ? '▲' : '▼' }} {{ Math.abs(kpi.trend) }}%
          </span>
        </div>
        <span class="kpi-sub">{{ kpi.sub }}</span>
      </div>
    </section>

    <!-- Diagramas -->
    <section class="charts">
      <span class="section-tag">// DIAGRAMAS</span>
      <div class="charts-grid">
        <!-- Salidas por mes -->
        <div class="chart-card chart-card--wide">
          <div class="chart-head">
            <h3 class="chart-title">Salidas por mes</h3>
            <span class="chart-sub">Emergencias atendidas · {{ currentYear }}</span>
          </div>
          <div class="chart-canvas">
            <Line :data="lineData" :options="lineOptions" />
          </div>
        </div>

        <!-- Estado de la flota -->
        <div class="chart-card">
          <div class="chart-head">
            <h3 class="chart-title">Estado de la flota</h3>
            <span class="chart-sub">30 unidades</span>
          </div>
          <div class="chart-canvas chart-canvas--doughnut">
            <Doughnut :data="doughnutData" :options="doughnutOptions" />
          </div>
        </div>

        <!-- Incidentes por tipo -->
        <div class="chart-card chart-card--wide">
          <div class="chart-head">
            <h3 class="chart-title">Incidentes por tipo</h3>
            <span class="chart-sub">Últimos 30 días</span>
          </div>
          <div class="chart-canvas">
            <Bar :data="barData" :options="barOptions" />
          </div>
        </div>

        <!-- Tiempo de respuesta -->
        <div class="chart-card">
          <div class="chart-head">
            <h3 class="chart-title">Tiempo de respuesta</h3>
            <span class="chart-sub">Minutos promedio por guardia</span>
          </div>
          <div class="chart-canvas chart-canvas--doughnut">
            <Bar :data="responseData" :options="responseOptions" />
          </div>
        </div>

        <!-- Personal por área -->
        <div class="chart-card chart-card--wide">
          <div class="chart-head">
            <h3 class="chart-title">Personal por área</h3>
            <span class="chart-sub">Distribución de la fuerza operativa</span>
          </div>
          <div class="chart-canvas">
            <Bar :data="staffData" :options="staffOptions" />
          </div>
        </div>

        <!-- Eficiencia -->
        <div class="chart-card">
          <div class="chart-head">
            <h3 class="chart-title">Eficiencia operativa</h3>
            <span class="chart-sub">Cumplimiento vs objetivo</span>
          </div>
          <div class="chart-canvas chart-canvas--doughnut">
            <Doughnut :data="efficiencyData" :options="doughnutOptions" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { Line, Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  LineElement, PointElement,
  BarElement, ArcElement,
  CategoryScale, LinearScale, Filler,
} from 'chart.js'

ChartJS.register(
  Title, Tooltip, Legend,
  LineElement, PointElement,
  BarElement, ArcElement,
  CategoryScale, LinearScale, Filler
)

// Paleta alineada al tema de la app.
const RED = '#dc2626'
const RED_SOFT = 'rgba(220,38,38,0.15)'
const AMBER = '#f59e0b'
const GREEN = '#16a34a'
const BLUE = '#3b82f6'
const GRID = 'rgba(148,148,160,0.12)'
const TEXT = 'rgba(160,160,170,0.9)'

export default {
  name: 'DataStudioView',
  components: { Line, Doughnut, Bar },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      period: 'year',

      kpis: [
        { label: 'Salidas totales', value: '844', trend: 12, sub: 'vs. periodo anterior' },
        { label: 'Tiempo respuesta', value: '6.5 min', trend: -4, sub: 'promedio general' },
        { label: 'Flota operativa', value: '73%', trend: 3, sub: '22 de 30 unidades' },
        { label: 'Eficiencia', value: '91%', trend: 6, sub: 'cumplimiento de objetivos' },
      ],

      // --- NOTA BACKEND ---
      // Datos de ejemplo (solo frontend), los mismos indicadores del
      // Dashboard. Reemplazar por la respuesta real de la API.
      lineData: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
          label: 'Salidas',
          data: [42, 55, 48, 63, 71, 66, 84, 79, 72, 88, 95, 81],
          borderColor: RED,
          backgroundColor: RED_SOFT,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: RED,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
        }],
      },

      doughnutData: {
        labels: ['Operativas', 'En taller', 'Inoperativas'],
        datasets: [{
          data: [22, 5, 3],
          backgroundColor: [GREEN, AMBER, RED],
          borderColor: 'rgba(0,0,0,0.2)',
          borderWidth: 2,
          hoverOffset: 6,
        }],
      },

      barData: {
        labels: ['Incendio', 'Rescate', 'Médica', 'Fuga gas', 'Accidente', 'Otro'],
        datasets: [{
          label: 'Incidentes',
          data: [38, 24, 46, 12, 31, 9],
          backgroundColor: RED,
          borderRadius: 4,
          maxBarThickness: 34,
        }],
      },

      responseData: {
        labels: ['Guardia A', 'Guardia B', 'Guardia C', 'Guardia D'],
        datasets: [{
          label: 'Min',
          data: [6.2, 7.1, 5.8, 6.9],
          backgroundColor: [RED, AMBER, GREEN, RED],
          borderRadius: 4,
          maxBarThickness: 22,
        }],
      },

      staffData: {
        labels: ['Combate', 'Rescate', 'Médica', 'Logística', 'Mando'],
        datasets: [{
          label: 'Personal',
          data: [46, 28, 18, 12, 8],
          backgroundColor: BLUE,
          borderRadius: 4,
          maxBarThickness: 34,
        }],
      },

      efficiencyData: {
        labels: ['Cumplido', 'Pendiente'],
        datasets: [{
          data: [91, 9],
          backgroundColor: [GREEN, 'rgba(148,148,160,0.2)'],
          borderColor: 'rgba(0,0,0,0.2)',
          borderWidth: 2,
          hoverOffset: 6,
        }],
      },
    }
  },
  computed: {
    lineOptions() { return this.baseOptions({ legend: false }) },
    barOptions() { return this.baseOptions({ legend: false }) },
    staffOptions() { return this.baseOptions({ legend: false }) },
    responseOptions() {
      return {
        ...this.baseOptions({ legend: false }),
        indexAxis: 'y',
      }
    },
    doughnutOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: TEXT, boxWidth: 10, boxHeight: 10, padding: 14, font: { size: 11 } },
          },
          tooltip: this.tooltipStyle(),
        },
      }
    },
  },
  methods: {
    tooltipStyle() {
      return {
        backgroundColor: '#1a1a1c',
        borderColor: 'rgba(220,38,38,0.4)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: TEXT,
        padding: 10,
        cornerRadius: 6,
      }
    },
    baseOptions({ legend = true } = {}) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: legend, labels: { color: TEXT } },
          tooltip: this.tooltipStyle(),
        },
        scales: {
          x: {
            grid: { color: GRID, drawBorder: false },
            ticks: { color: TEXT, font: { size: 11 } },
          },
          y: {
            grid: { color: GRID, drawBorder: false },
            ticks: { color: TEXT, font: { size: 11 } },
            beginAtZero: true,
          },
        },
      }
    },
  },
}
</script>

<style scoped>
.datastudio-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.view-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
@media (min-width: 720px) {
  .view-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.section-tag {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  letter-spacing: 0.16em;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.view-title {
  font-family: var(--font-display);
  font-size: 1.7rem;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}
.view-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 6px 0 0;
}

.header-actions { display: flex; gap: 10px; }
.period-select {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-primary);
  padding: 8px 12px;
  font-size: 0.82rem;
  font-family: var(--font-sans);
  cursor: pointer;
}
.period-select:focus {
  outline: none;
  border-color: rgba(220, 38, 38, 0.5);
}

/* KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
@media (min-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(4, 1fr); }
}

.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.kpi-label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.kpi-value {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--text-primary);
  line-height: 1;
}
.kpi-trend {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 600;
}
.kpi-trend.up { color: #16a34a; }
.kpi-trend.down { color: #dc2626; }
.kpi-sub {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* Charts */
.charts { margin-bottom: 24px; }

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 720px) {
  .charts-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1100px) {
  .charts-grid { grid-template-columns: 2fr 1fr; }
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 18px 18px 14px;
  display: flex;
  flex-direction: column;
}

.chart-head { margin-bottom: 12px; }
.chart-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--text-primary);
  margin: 0;
}
.chart-sub {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.chart-canvas {
  position: relative;
  height: 220px;
  width: 100%;
}
.chart-canvas--doughnut { height: 240px; }
</style>
