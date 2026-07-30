<template>
  <div class="fleet-analytics-view">
    <div class="view-header">
      <div>
        <span class="section-tag">// ANALITICA DE FLOTA</span>
        <h2 class="view-title">Consumo y Rendimiento</h2>
      </div>
      <div class="header-actions">
        <div class="date-range">
          <button 
            v-for="range in dateRanges" 
            :key="range.value"
            class="range-btn"
            :class="{ 'range-btn--active': selectedRange === range.value }"
            @click="selectedRange = range.value"
          >{{ range.label }}</button>
        </div>
        <button class="action-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar Reporte
        </button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Consumo Total</span>
          <span class="stat-trend stat-trend--up">+8.2%</span>
        </div>
        <div class="stat-value">{{ formatNumber(stats.totalFuel) }} <span class="stat-unit">L</span></div>
        <div class="stat-comparison">vs {{ formatNumber(stats.totalFuelPrev) }} L periodo anterior</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Costo Total</span>
          <span class="stat-trend stat-trend--up">+12.5%</span>
        </div>
        <div class="stat-value">${{ formatNumber(stats.totalCost) }}</div>
        <div class="stat-comparison">vs ${{ formatNumber(stats.totalCostPrev) }} periodo anterior</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Km Recorridos</span>
          <span class="stat-trend stat-trend--down">-3.1%</span>
        </div>
        <div class="stat-value">{{ formatNumber(stats.totalKm) }} <span class="stat-unit">km</span></div>
        <div class="stat-comparison">{{ vehicles.length }} unidades activas</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Rendimiento Promedio</span>
          <span class="stat-trend stat-trend--down">-5.4%</span>
        </div>
        <div class="stat-value">{{ stats.avgEfficiency.toFixed(1) }} <span class="stat-unit">km/L</span></div>
        <div class="stat-comparison">Meta: 4.5 km/L</div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="analytics-content">
      <!-- Left: Charts -->
      <div class="charts-panel">
        <!-- Consumption Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Consumo Mensual</h3>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-dot legend-dot--primary"></span> Combustible (L)</span>
              <span class="legend-item"><span class="legend-dot legend-dot--secondary"></span> Costo ($)</span>
            </div>
          </div>
          <div class="chart-area">
            <svg viewBox="0 0 600 200" class="line-chart">
              <!-- Grid lines -->
              <g class="grid-lines">
                <line v-for="i in 5" :key="i" :x1="50" :y1="i * 35 + 10" :x2="580" :y2="i * 35 + 10" stroke="var(--border-subtle)" stroke-dasharray="4"/>
              </g>
              <!-- Consumption bars -->
              <g class="bars">
                <rect 
                  v-for="(month, idx) in consumptionData" 
                  :key="'bar-'+idx"
                  :x="70 + idx * 45"
                  :y="185 - month.fuel / maxFuel * 150"
                  width="18"
                  :height="month.fuel / maxFuel * 150"
                  fill="var(--accent-primary)"
                  rx="2"
                  opacity="0.8"
                />
              </g>
              <!-- Cost line -->
              <polyline 
                :points="costLinePoints"
                fill="none"
                stroke="var(--accent-green)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g class="cost-dots">
                <circle 
                  v-for="(month, idx) in consumptionData" 
                  :key="'dot-'+idx"
                  :cx="79 + idx * 45"
                  :cy="185 - month.cost / maxCost * 150"
                  r="4"
                  fill="var(--accent-green)"
                />
              </g>
              <!-- X axis labels -->
              <g class="x-labels">
                <text 
                  v-for="(month, idx) in consumptionData" 
                  :key="'label-'+idx"
                  :x="79 + idx * 45"
                  y="198"
                  text-anchor="middle"
                  class="axis-label"
                >{{ month.month }}</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Efficiency by Vehicle Type -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Rendimiento por Tipo de Unidad</h3>
          </div>
          <div class="efficiency-bars">
            <div v-for="type in vehicleTypeEfficiency" :key="type.type" class="efficiency-row">
              <span class="efficiency-label">{{ type.type }}</span>
              <div class="efficiency-bar-wrap">
                <div class="efficiency-bar" :style="{ width: (type.efficiency / 6 * 100) + '%' }">
                  <span class="efficiency-value">{{ type.efficiency.toFixed(1) }} km/L</span>
                </div>
              </div>
              <span class="efficiency-target" :class="{ 'below-target': type.efficiency < type.target }">
                Meta: {{ type.target }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Vehicle List -->
      <div class="vehicles-panel">
        <div class="panel-header">
          <h3 class="panel-title">Consumo por Unidad</h3>
          <select v-model="sortBy" class="sort-select">
            <option value="consumption">Mayor Consumo</option>
            <option value="efficiency">Menor Rendimiento</option>
            <option value="cost">Mayor Costo</option>
            <option value="km">Mayor Kilometraje</option>
          </select>
        </div>
        <div class="vehicles-list">
          <div v-for="vehicle in sortedVehicles" :key="vehicle.id" class="vehicle-row">
            <div class="vehicle-info">
              <span class="vehicle-unit">U-{{ vehicle.unit }}</span>
              <span class="vehicle-type">{{ vehicle.type }}</span>
            </div>
            <div class="vehicle-stats">
              <div class="mini-stat">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                <span>{{ vehicle.fuel }} L</span>
              </div>
              <div class="mini-stat">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span>${{ formatNumber(vehicle.cost) }}</span>
              </div>
              <div class="mini-stat">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{{ formatNumber(vehicle.km) }} km</span>
              </div>
            </div>
            <div class="vehicle-efficiency" :class="getEfficiencyClass(vehicle.efficiency)">
              {{ vehicle.efficiency.toFixed(1) }} km/L
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom: Fuel Log & Alerts -->
    <div class="bottom-section">
      <div class="fuel-log-card">
        <div class="card-header">
          <h3 class="card-title">Ultimas Cargas de Combustible</h3>
          <button class="add-btn">+ Registrar Carga</button>
        </div>
        <table class="fuel-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Unidad</th>
              <th>Litros</th>
              <th>Costo</th>
              <th>Km Actual</th>
              <th>Operador</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in fuelLogs" :key="log.id">
              <td>{{ formatDate(log.date) }}</td>
              <td><span class="unit-badge">U-{{ log.unit }}</span></td>
              <td>{{ log.liters }} L</td>
              <td>${{ formatNumber(log.cost) }}</td>
              <td>{{ formatNumber(log.km) }} km</td>
              <td>{{ log.operator }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="alerts-card">
        <div class="card-header">
          <h3 class="card-title">Alertas de Consumo</h3>
        </div>
        <div class="alerts-list">
          <div v-for="alert in consumptionAlerts" :key="alert.id" class="alert-item" :class="`alert-item--${alert.severity}`">
            <div class="alert-icon">
              <svg v-if="alert.severity === 'high'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div class="alert-content">
              <span class="alert-title">{{ alert.title }}</span>
              <span class="alert-desc">{{ alert.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFleetAnalyticsData, getConsumptionData, getFuelLogs, getConsumptionAlerts } from '@/components/scripts/getFleetAnalytics';

export default {
  name: 'FleetAnalyticsView',
  data() {
    return {
      selectedRange: '30d',
      sortBy: 'consumption',
      dateRanges: [
        { label: '7 dias', value: '7d' },
        { label: '30 dias', value: '30d' },
        { label: '90 dias', value: '90d' },
        { label: 'Ano', value: '1y' }
      ],
      stats: {
        totalFuel: 0,
        totalFuelPrev: 0,
        totalCost: 0,
        totalCostPrev: 0,
        totalKm: 0,
        avgEfficiency: 0
      },
      vehicles: [],
      consumptionData: [],
      vehicleTypeEfficiency: [],
      fuelLogs: [],
      consumptionAlerts: []
    }
  },
  computed: {
    maxFuel() {
      return Math.max(...this.consumptionData.map(d => d.fuel), 1);
    },
    maxCost() {
      return Math.max(...this.consumptionData.map(d => d.cost), 1);
    },
    costLinePoints() {
      return this.consumptionData.map((month, idx) => {
        const x = 79 + idx * 45;
        const y = 185 - month.cost / this.maxCost * 150;
        return `${x},${y}`;
      }).join(' ');
    },
    sortedVehicles() {
      const sorted = [...this.vehicles];
      switch (this.sortBy) {
        case 'consumption': return sorted.sort((a, b) => b.fuel - a.fuel);
        case 'efficiency': return sorted.sort((a, b) => a.efficiency - b.efficiency);
        case 'cost': return sorted.sort((a, b) => b.cost - a.cost);
        case 'km': return sorted.sort((a, b) => b.km - a.km);
        default: return sorted;
      }
    }
  },
  methods: {
    formatNumber(num) {
      return num.toLocaleString('es-MX');
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    },
    getEfficiencyClass(efficiency) {
      if (efficiency >= 4.5) return 'efficiency--good';
      if (efficiency >= 3.5) return 'efficiency--warning';
      return 'efficiency--bad';
    }
  },
  async mounted() {
    const data = await getFleetAnalyticsData();
    this.stats = data.stats;
    this.vehicles = data.vehicles;
    this.vehicleTypeEfficiency = data.vehicleTypeEfficiency;
    this.consumptionData = await getConsumptionData();
    this.fuelLogs = await getFuelLogs();
    this.consumptionAlerts = await getConsumptionAlerts();
  }
}
</script>

<style scoped>
.fleet-analytics-view { padding-top: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }

.view-header { display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
.section-tag { font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-primary); letter-spacing: 0.2em; display: block; margin-bottom: 4px; }
.view-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--text-primary); letter-spacing: 0.06em; }

.header-actions { display: flex; gap: 12px; align-items: center; }
.date-range { display: flex; gap: 2px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius); padding: 2px; }
.range-btn { padding: 5px 12px; background: transparent; border: none; color: var(--text-muted); font-family: var(--font-display); font-size: 0.7rem; font-weight: 600; cursor: pointer; border-radius: var(--radius); transition: all 0.2s; }
.range-btn:hover { color: var(--text-primary); }
.range-btn--active { background: var(--accent-primary); color: #000; }

.action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius); color: var(--text-secondary); font-family: var(--font-display); font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: var(--border-accent); color: var(--text-primary); }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; flex-shrink: 0; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 14px; }
.stat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.stat-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }
.stat-trend { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 600; padding: 2px 6px; border-radius: 2px; }
.stat-trend--up { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.stat-trend--down { background: var(--accent-green-glow); color: var(--accent-green); }
.stat-value { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; color: var(--text-primary); line-height: 1.1; }
.stat-unit { font-size: 0.9rem; color: var(--text-muted); }
.stat-comparison { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-muted); letter-spacing: 0.05em; margin-top: 4px; }

/* Main Content */
.analytics-content { display: flex; gap: 16px; flex: 1; min-height: 0; overflow: hidden; }

/* Charts Panel */
.charts-panel { flex: 1; display: flex; flex-direction: column; gap: 12px; overflow: hidden; }

.chart-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 14px; flex: 1; display: flex; flex-direction: column; }
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.chart-title { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.chart-legend { display: flex; gap: 14px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); }
.legend-dot { width: 8px; height: 8px; border-radius: 2px; }
.legend-dot--primary { background: var(--accent-primary); }
.legend-dot--secondary { background: var(--accent-green); }

.chart-area { flex: 1; min-height: 0; }
.line-chart { width: 100%; height: 100%; }
.axis-label { font-family: var(--font-mono); font-size: 9px; fill: var(--text-muted); }

/* Efficiency Bars */
.efficiency-bars { display: flex; flex-direction: column; gap: 10px; flex: 1; justify-content: center; }
.efficiency-row { display: flex; align-items: center; gap: 12px; }
.efficiency-label { width: 80px; font-family: var(--font-display); font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
.efficiency-bar-wrap { flex: 1; height: 24px; background: var(--bg-secondary); border-radius: var(--radius); overflow: hidden; }
.efficiency-bar { height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-green)); border-radius: var(--radius); display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; min-width: 60px; }
.efficiency-value { font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600; color: #000; }
.efficiency-target { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); width: 60px; text-align: right; }
.efficiency-target.below-target { color: var(--accent-orange); }

/* Vehicles Panel */
.vehicles-panel { width: 340px; flex-shrink: 0; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden; }
.panel-header { padding: 14px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; }
.panel-title { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.sort-select { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius); color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.65rem; padding: 4px 8px; cursor: pointer; }

.vehicles-list { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; }

.vehicle-row { display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius); transition: all 0.2s; }
.vehicle-row:hover { border-color: var(--border-accent); }

.vehicle-info { display: flex; flex-direction: column; }
.vehicle-unit { font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
.vehicle-type { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase; }

.vehicle-stats { flex: 1; display: flex; gap: 8px; }
.mini-stat { display: flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); }

.vehicle-efficiency { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; padding: 4px 8px; border-radius: var(--radius); }
.efficiency--good { background: var(--accent-green-glow); color: var(--accent-green); }
.efficiency--warning { background: var(--accent-orange-glow); color: var(--accent-orange); }
.efficiency--bad { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

/* Bottom Section */
.bottom-section { display: flex; gap: 16px; flex-shrink: 0; max-height: 200px; }

.fuel-log-card { flex: 1; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden; }
.card-header { padding: 12px 14px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; }
.card-title { font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.add-btn { background: var(--accent-primary); border: none; color: #000; font-family: var(--font-display); font-size: 0.7rem; font-weight: 600; padding: 5px 10px; border-radius: var(--radius); cursor: pointer; transition: all 0.2s; }
.add-btn:hover { background: var(--accent-primary-hover); }

.fuel-table { width: 100%; border-collapse: collapse; font-size: 0.75rem; }
.fuel-table th { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--border-subtle); }
.fuel-table td { padding: 8px 12px; color: var(--text-secondary); font-family: var(--font-body); border-bottom: 1px solid var(--border-subtle); }
.unit-badge { background: var(--bg-secondary); padding: 2px 6px; border-radius: 2px; font-family: var(--font-display); font-weight: 600; color: var(--text-primary); }

.alerts-card { width: 300px; flex-shrink: 0; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden; }
.alerts-list { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; }

.alert-item { display: flex; gap: 10px; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius); border-left: 3px solid transparent; }
.alert-item--high { border-left-color: #ef4444; }
.alert-item--medium { border-left-color: var(--accent-orange); }
.alert-item--low { border-left-color: var(--accent-blue); }

.alert-icon { flex-shrink: 0; }
.alert-item--high .alert-icon { color: #ef4444; }
.alert-item--medium .alert-icon { color: var(--accent-orange); }
.alert-item--low .alert-icon { color: var(--accent-blue); }

.alert-content { display: flex; flex-direction: column; gap: 2px; }
.alert-title { font-family: var(--font-display); font-size: 0.75rem; font-weight: 600; color: var(--text-primary); }
.alert-desc { font-family: var(--font-body); font-size: 0.65rem; color: var(--text-muted); }
</style>
