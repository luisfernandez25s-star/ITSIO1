<template>
  <div class="charts">
    <span class="section-tag">// INDICADORES Y ESTADÍSTICAS</span>
    <div class="charts-grid">
      <!-- Salidas por mes (linea) -->
      <div class="chart-card chart-card--wide">
        <div class="chart-head">
          <h3 class="chart-title">Salidas por mes</h3>
          <span class="chart-sub">Emergencias atendidas · {{ currentYear }}</span>
        </div>
        <div class="chart-canvas">
          <Line :data="lineData" :options="lineOptions" />
        </div>
      </div>

      <!-- Estado de la flota (dona) -->
      <div class="chart-card">
        <div class="chart-head">
          <h3 class="chart-title">Estado de la flota</h3>
          <span class="chart-sub">30 unidades</span>
        </div>
        <div class="chart-canvas chart-canvas--doughnut">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
      </div>

      <!-- Incidentes por tipo (barras) -->
      <div class="chart-card chart-card--wide">
        <div class="chart-head">
          <h3 class="chart-title">Incidentes por tipo</h3>
          <span class="chart-sub">Últimos 30 días</span>
        </div>
        <div class="chart-canvas">
          <Bar :data="barData" :options="barOptions" />
        </div>
      </div>

      <!-- Tiempo de respuesta (barras horizontales) -->
      <div class="chart-card">
        <div class="chart-head">
          <h3 class="chart-title">Tiempo de respuesta</h3>
          <span class="chart-sub">Minutos promedio por guardia</span>
        </div>
        <div class="chart-canvas chart-canvas--doughnut">
          <Bar :data="responseData" :options="responseOptions" />
        </div>
      </div>
    </div>
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
const GRID = 'rgba(148,148,160,0.12)'
const TEXT = 'rgba(160,160,170,0.9)'

export default {
  name: 'DashboardCharts',
  components: { Line, Doughnut, Bar },
  data() {
    return {
      currentYear: new Date().getFullYear(),

      // --- NOTA BACKEND ---
      // Estos datos son de ejemplo (solo frontend). El compañero de
      // backend debe reemplazarlos por la respuesta real de la API.
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
    }
  },
  computed: {
    lineOptions() { return this.baseOptions({ legend: false }) },
    barOptions() { return this.baseOptions({ legend: false }) },
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
.charts { margin-bottom: 24px; }

.section-tag {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  letter-spacing: 0.16em;
  margin-bottom: 14px;
  text-transform: uppercase;
}

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
  .chart-card--wide { grid-column: span 1; }
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
