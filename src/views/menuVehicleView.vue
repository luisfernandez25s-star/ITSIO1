<template>
  <div class="menu-vehicle">
    <!-- Header -->
    <div class="vehicle-header">
      <div class="header-left">
        <router-link :to="vehicleData ? `/type-vehicle/${vehicleData.type}` : '/typeToVehicles'" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Volver
        </router-link>
        <div>
          <span class="section-tag">// UNIDAD</span>
          <h2 class="unit-title">U-{{ vehicleNumber }}</h2>
        </div>
        <div v-if="vehicleData" class="vehicle-meta">
          <span :class="['status-badge', `status-${vehicleData.status}`]">
            <span class="status-dot"></span>
            {{ statusLabel(vehicleData.status) }}
          </span>
          <span class="meta-separator">|</span>
          <span class="meta-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/></svg>
            {{ vehicleData.carBrand }} {{ vehicleData.model }}
          </span>
          <span class="meta-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/></svg>
            {{ vehicleData.placas }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-nav">
      <button
        v-for="tab in tabs" :key="tab.id"
        class="tab-btn"
        :class="{ 'tab-btn--active': componentView === tab.id }"
        @click="componentView = tab.id"
      >
        <span class="tab-icon" v-html="tab.icon"></span>
        <span>{{ tab.label }}</span>
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <generalInfoVehicle v-if="componentView === 1" />
      <receptionLogsVehicle v-if="componentView === 2" />
      <LogsServiceVehicle v-if="componentView === 3" />
      <maintenanceLogVehicle v-if="componentView === 4" :vehicleNumber="vehicleNumber" />
    </div>
  </div>
</template>

<script>
import { getTypeVehicle } from '@/components/scripts/getVehicles';
import generalInfoVehicle from '@/components/components-on-views/vehicles/generalInfoVehicle.vue';
import receptionLogsVehicle from '@/components/components-on-views/vehicles/receptionLogsVehicle.vue';
import LogsServiceVehicle from '@/components/components-on-views/vehicles/logsServiceVehicle.vue';
import maintenanceLogVehicle from '@/components/components-on-views/vehicles/maintenanceLogVehicle.vue';

export default {
  name: 'menuVehicleView',
  components: { generalInfoVehicle, receptionLogsVehicle, LogsServiceVehicle, maintenanceLogVehicle },
  data() {
    return {
      vehicleNumber: 0,
      vehicleData: null,
      componentView: 1,
      tabs: [
        { id: 1, label: 'Info General', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
        { id: 2, label: 'Bitácora Recepción', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` },
        { id: 3, label: 'Bitácora Servicio', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
        { id: 4, label: 'Mant. e Incidentes', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>` },
      ]
    }
  },
  async created() {
    this.vehicleNumber = this.$route.params.numberVehicle;
    this.vehicleData = await getTypeVehicle(this.vehicleNumber);
  },
  methods: {
    statusLabel(s) {
      return { 'operativa': 'Operativa', 'taller': 'En taller', 'in-operativa': 'Inoperativa' }[s] || s;
    }
  }
}
</script>

<style scoped>
.menu-vehicle {
  padding-top: 16px;
  height: 100%;
  display: flex; flex-direction: column;
  gap: 12px; overflow: hidden;
}

.vehicle-header { display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
.header-left { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; }

.back-link {
  display: flex; align-items: center; gap: 5px;
  font-family: var(--font-mono); font-size: 0.68rem;
  color: var(--text-muted); text-decoration: none;
  letter-spacing: 0.1em; transition: color 0.2s;
  padding-bottom: 4px; white-space: nowrap;
}
.back-link:hover { color: var(--accent-secondary); }

.unit-title {
  font-family: var(--font-display); font-size: 1.6rem; font-weight: 700;
  margin: 0; color: var(--text-primary); letter-spacing: 0.12em;
}

.vehicle-meta { display: flex; align-items: center; gap: 10px; padding-bottom: 4px; flex-wrap: wrap; }
.meta-separator { color: var(--border-subtle); }
.meta-item {
  display: flex; align-items: center; gap: 5px;
  font-family: var(--font-mono); font-size: 0.68rem;
  color: var(--text-secondary); letter-spacing: 0.05em;
}

.status-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: currentColor; animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* Tabs */
.tab-nav {
  display: flex; gap: 2px;
  background: var(--bg-primary);
  padding: 4px; border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle); flex-shrink: 0;
}

.tab-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 16px;
  border-radius: var(--radius); border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-display); font-size: 0.8rem; font-weight: 600;
  letter-spacing: 0.06em; cursor: pointer; transition: all 0.2s;
  white-space: nowrap;
}
.tab-btn:hover { color: var(--text-primary); background: var(--bg-card); border-color: var(--border-subtle); }
.tab-btn--active {
  background: var(--bg-card) !important;
  color: var(--accent-secondary) !important;
  border-color: rgba(220,38,38,0.3) !important;
}

.tab-icon { display: flex; align-items: center; }

.tab-badge {
  font-family: var(--font-mono); font-size: 0.48rem;
  letter-spacing: 0.1em;
  background: rgba(245,158,11,0.1);
  color: var(--accent-amber);
  border: 1px solid rgba(245,158,11,0.25);
  padding: 1px 5px; border-radius: 2px;
}

.tab-content {
  flex: 1; overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

/* Coming soon */
.coming-soon {
  height: 100%; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
}
.cs-icon-wrap {
  width: 64px; height: 64px; border-radius: var(--radius-xl);
  background: rgba(220,38,38,0.08);
  border: 1px solid rgba(220,38,38,0.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent-secondary);
}
.cs-text {
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  color: var(--text-secondary); margin: 0;
}
.cs-sub { font-family: var(--font-body); font-size: 0.8rem; color: var(--text-muted); margin: 0; text-align: center; }
.cs-badge {
  font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.2em;
  color: var(--accent-amber); border: 1px solid rgba(245,158,11,0.25);
  padding: 4px 14px; border-radius: 2px; background: rgba(245,158,11,0.07);
}
</style>
