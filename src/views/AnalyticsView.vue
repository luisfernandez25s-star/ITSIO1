<template>
  <div class="analytics-view">
    <header class="view-header">
      <div class="header-content">
        <span class="section-tag">// PANEL DE ESTADÍSTICAS</span>
        <h1 class="view-title">Analytics Dashboard</h1>
      </div>
      <div class="header-actions">
        <select class="period-select" v-model="selectedPeriod">
          <option value="week">Esta Semana</option>
          <option value="month">Este Mes</option>
          <option value="quarter">Trimestre</option>
          <option value="year">Este Año</option>
        </select>
      </div>
    </header>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-primary">
        <div class="kpi-header">
          <span class="kpi-label">Tiempo de Respuesta</span>
          <div class="kpi-trend" :class="kpis.responseTime.trend < 0 ? 'trend-good' : 'trend-bad'">
            <svg v-if="kpis.responseTime.trend < 0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            {{ Math.abs(kpis.responseTime.trend) }} min
          </div>
        </div>
        <div class="kpi-value">{{ kpis.responseTime.current }}<span class="kpi-unit">min</span></div>
        <div class="kpi-target">Meta: {{ kpis.responseTime.target }} min</div>
        <div class="kpi-progress">
          <div class="progress-bar" :style="{ width: Math.min((kpis.responseTime.target / kpis.responseTime.current) * 100, 100) + '%' }"></div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Incidentes Hoy</span>
          <div class="kpi-icon" style="color: var(--accent-orange)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
          </div>
        </div>
        <div class="kpi-value">{{ kpis.incidentsToday }}</div>
        <div class="kpi-target">Este mes: {{ kpis.incidentsMonth }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Disponibilidad Flota</span>
          <div class="kpi-icon" style="color: var(--accent-green)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
        </div>
        <div class="kpi-value">{{ kpis.fleetAvailability }}<span class="kpi-unit">%</span></div>
        <div class="kpi-target">Meta: {{ kpis.fleetAvailabilityTarget }}%</div>
        <div class="kpi-gauge">
          <div class="gauge-fill" :style="{ width: kpis.fleetAvailability + '%' }" :class="kpis.fleetAvailability >= kpis.fleetAvailabilityTarget ? 'gauge-good' : 'gauge-warn'"></div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Personal en Turno</span>
          <div class="kpi-icon" style="color: var(--accent-blue)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>
        <div class="kpi-value">{{ kpis.personnelOnDuty }}<span class="kpi-unit">/{{ kpis.totalPersonnel }}</span></div>
        <div class="kpi-target">{{ Math.round((kpis.personnelOnDuty / kpis.totalPersonnel) * 100) }}% de la plantilla</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <!-- Response Time Chart -->
      <div class="chart-card chart-wide">
        <div class="chart-header">
          <h3 class="chart-title">Tiempo de Respuesta (Últimos 7 días)</h3>
          <span class="chart-subtitle">Promedio en minutos</span>
        </div>
        <div class="bar-chart">
          <div v-for="item in responseTimeHistory" :key="item.date" class="bar-item">
            <div class="bar-wrapper">
              <div class="bar" :style="{ height: (item.avgTime / 6) * 100 + '%' }" :class="item.avgTime <= 5 ? 'bar-good' : 'bar-warn'">
                <span class="bar-value">{{ item.avgTime }}</span>
              </div>
            </div>
            <span class="bar-label">{{ item.date }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-dot" style="background: var(--accent-green)"></span>Dentro de meta</span>
          <span class="legend-item"><span class="legend-dot" style="background: var(--accent-amber)"></span>Fuera de meta</span>
        </div>
      </div>

      <!-- Incidents by Type -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Incidentes por Tipo</h3>
          <span class="chart-subtitle">Distribución mensual</span>
        </div>
        <div class="donut-chart">
          <svg viewBox="0 0 100 100" class="donut">
            <circle v-for="(item, index) in incidentsByType" :key="item.type"
              cx="50" cy="50" r="35"
              fill="none"
              :stroke="item.color"
              stroke-width="12"
              :stroke-dasharray="calculateDash(item.percentage)"
              :stroke-dashoffset="calculateOffset(index)"
              class="donut-segment"
            />
          </svg>
          <div class="donut-center">
            <span class="donut-total">{{ kpis.incidentsMonth }}</span>
            <span class="donut-label">Total</span>
          </div>
        </div>
        <div class="type-legend">
          <div v-for="item in incidentsByType" :key="item.type" class="type-item">
            <span class="type-dot" :style="{ background: item.color }"></span>
            <span class="type-name">{{ item.type }}</span>
            <span class="type-count">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="bottom-row">
      <!-- Hourly Distribution -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Distribución Horaria</h3>
          <span class="chart-subtitle">Incidentes por franja horaria</span>
        </div>
        <div class="hourly-chart">
          <div v-for="item in hourlyDistribution" :key="item.hour" class="hourly-bar">
            <div class="hourly-fill" :style="{ height: (item.incidents / 50) * 100 + '%' }"></div>
            <span class="hourly-value">{{ item.incidents }}</span>
            <span class="hourly-label">{{ item.hour }}</span>
          </div>
        </div>
      </div>

      <!-- Top Locations -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Zonas con Mayor Incidencia</h3>
          <span class="chart-subtitle">Top 5 ubicaciones</span>
        </div>
        <div class="locations-list">
          <div v-for="(loc, index) in topLocations" :key="loc.location" class="location-item">
            <span class="location-rank">#{{ index + 1 }}</span>
            <div class="location-info">
              <span class="location-name">{{ loc.location }}</span>
              <div class="location-bar-wrapper">
                <div class="location-bar" :style="{ width: loc.percentage * 3 + '%' }"></div>
              </div>
            </div>
            <span class="location-count">{{ loc.incidents }}</span>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Métricas de Rendimiento</h3>
          <span class="chart-subtitle">Indicadores clave</span>
        </div>
        <div class="metrics-list">
          <div class="metric-item">
            <div class="metric-label">Tasa de Éxito</div>
            <div class="metric-value">{{ performanceMetrics.successRate }}%</div>
            <div class="metric-bar"><div class="metric-fill good" :style="{ width: performanceMetrics.successRate + '%' }"></div></div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Satisfacción Ciudadana</div>
            <div class="metric-value">{{ performanceMetrics.citizenSatisfaction }}/5</div>
            <div class="metric-bar"><div class="metric-fill good" :style="{ width: (performanceMetrics.citizenSatisfaction / 5) * 100 + '%' }"></div></div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Equipo Disponible</div>
            <div class="metric-value">{{ performanceMetrics.equipmentReadiness }}%</div>
            <div class="metric-bar"><div class="metric-fill" :class="performanceMetrics.equipmentReadiness >= 90 ? 'good' : 'warn'" :style="{ width: performanceMetrics.equipmentReadiness + '%' }"></div></div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Tiempo en Escena (prom)</div>
            <div class="metric-value">{{ performanceMetrics.avgOnSceneTime }} min</div>
            <div class="metric-bar"><div class="metric-fill" :class="performanceMetrics.avgOnSceneTime <= performanceMetrics.onSceneTimeTarget ? 'good' : 'warn'" :style="{ width: Math.min((performanceMetrics.onSceneTimeTarget / performanceMetrics.avgOnSceneTime) * 100, 100) + '%' }"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getKPIs, getResponseTimeHistory, getIncidentsByType, getHourlyDistribution, getTopIncidentLocations, getPerformanceMetrics } from '@/components/scripts/getAnalytics.js'

export default {
  name: 'AnalyticsView',
  data() {
    return {
      selectedPeriod: 'month',
      kpis: {
        responseTime: { current: 0, target: 5, trend: 0 },
        incidentsToday: 0,
        incidentsMonth: 0,
        fleetAvailability: 0,
        fleetAvailabilityTarget: 80,
        personnelOnDuty: 0,
        totalPersonnel: 0
      },
      responseTimeHistory: [],
      incidentsByType: [],
      hourlyDistribution: [],
      topLocations: [],
      performanceMetrics: {
        successRate: 0,
        citizenSatisfaction: 0,
        equipmentReadiness: 0,
        avgOnSceneTime: 0,
        onSceneTimeTarget: 30
      },
      accumulatedOffset: 0
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.kpis = await getKPIs()
      this.responseTimeHistory = await getResponseTimeHistory()
      this.incidentsByType = await getIncidentsByType()
      this.hourlyDistribution = await getHourlyDistribution()
      this.topLocations = await getTopIncidentLocations()
      this.performanceMetrics = await getPerformanceMetrics()
    },
    calculateDash(percentage) {
      const circumference = 2 * Math.PI * 35
      const dash = (percentage / 100) * circumference
      return `${dash} ${circumference - dash}`
    },
    calculateOffset(index) {
      const circumference = 2 * Math.PI * 35
      let offset = circumference * 0.25 // Start at top
      for (let i = 0; i < index; i++) {
        offset -= (this.incidentsByType[i].percentage / 100) * circumference
      }
      return offset
    }
  }
}
</script>

<style scoped>
.analytics-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-top: 20px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.view-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 4px 0 0 0;
}

.period-select {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 8px 12px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  cursor: pointer;
}
.period-select:focus { outline: none; border-color: var(--border-accent); }

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 12px;
}

.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 18px;
}

.kpi-card.kpi-primary {
  background: linear-gradient(135deg, rgba(220,38,38,0.1), rgba(220,38,38,0.02));
  border-color: rgba(220,38,38,0.25);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.kpi-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 2px;
}
.trend-good { background: rgba(34,197,94,0.15); color: var(--accent-green); }
.trend-bad { background: rgba(239,68,68,0.15); color: var(--accent-red); }

.kpi-icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius);
  background: rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.kpi-unit {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-left: 4px;
}

.kpi-target {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  margin-top: 6px;
  letter-spacing: 0.06em;
}

.kpi-progress,
.kpi-gauge {
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--accent-primary);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.gauge-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}
.gauge-good { background: var(--accent-green); }
.gauge-warn { background: var(--accent-amber); }

/* Charts Row */
.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 18px;
}

.chart-header {
  margin-bottom: 16px;
}

.chart-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.chart-subtitle {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 140px;
  padding: 0 10px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-wrapper {
  height: 110px;
  width: 28px;
  background: rgba(255,255,255,0.03);
  border-radius: 3px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar {
  width: 100%;
  border-radius: 3px 3px 0 0;
  display: flex;
  justify-content: center;
  padding-top: 6px;
  transition: height 0.5s ease;
}
.bar-good { background: var(--accent-green); }
.bar-warn { background: var(--accent-amber); }

.bar-value {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--bg-primary);
  font-weight: 600;
}

.bar-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  margin-top: 8px;
  letter-spacing: 0.04em;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

/* Donut Chart */
.donut-chart {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 16px;
}

.donut {
  transform: rotate(-90deg);
}

.donut-segment {
  transition: stroke-dasharray 0.5s ease;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.donut-total {
  display: block;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
}

.donut-label {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.type-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.type-name {
  flex: 1;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.type-count {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-primary);
  font-weight: 600;
}

/* Bottom Row */
.bottom-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

/* Hourly Chart */
.hourly-chart {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.hourly-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 120px;
}

.hourly-fill {
  width: 100%;
  background: linear-gradient(180deg, var(--accent-primary), rgba(220,38,38,0.3));
  border-radius: 3px 3px 0 0;
  margin-top: auto;
  transition: height 0.5s ease;
}

.hourly-value {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-secondary);
  margin-top: 6px;
}

.hourly-label {
  font-family: var(--font-mono);
  font-size: 0.5rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

/* Locations List */
.locations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-rank {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--accent-secondary);
  width: 24px;
}

.location-info {
  flex: 1;
}

.location-name {
  display: block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.location-bar-wrapper {
  height: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 2px;
}

.location-bar {
  height: 100%;
  background: var(--accent-primary);
  border-radius: 2px;
}

.location-count {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 600;
}

/* Metrics List */
.metrics-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.metric-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.metric-label {
  flex: 1;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.metric-value {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-primary);
  font-weight: 600;
}

.metric-bar {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 2px;
  margin-top: 6px;
}

.metric-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}
.metric-fill.good { background: var(--accent-green); }
.metric-fill.warn { background: var(--accent-amber); }
</style>
