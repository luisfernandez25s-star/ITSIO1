<template>
  <div class="all-vehicles-view">
    <div class="view-header">
      <div class="header-left">
        <router-link to="/typeToVehicles" class="back-link">← Volver</router-link>
        <div>
          <span class="section-tag">// UNIDADES</span>
          <h2 class="view-title">{{ $route.params.type }}</h2>
        </div>
      </div>

      <div class="filter-group">
        <span class="filter-label">Filtrar por estado:</span>
        <div class="filter-buttons">
          <button
            v-for="opt in filterOptions"
            :key="opt.value"
            class="filter-btn"
            :class="{ 'filter-btn--active': operativa === opt.value, [`filter-btn--${opt.color}`]: operativa === opt.value }"
            @click="operativa = opt.value; onStatusChange()"
          >{{ opt.label }}</button>
        </div>
      </div>
    </div>

    <div v-if="stockVehicle.length === 0" class="empty-state">
      <svg class="empty-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p>No se encontraron unidades con ese estado</p>
    </div>

    <div class="vehicles-grid" v-else>
      <router-link
        v-for="(value, index) in stockVehicle"
        :key="index"
        class="vehicle-card"
        :to="`/type-vehicle/description-u/${value.numberUnit}`"
      >
        <div class="vehicle-img-wrap">
          <img :src="getVehicleThumbnail(value.img)" :alt="`Unidad ${value.numberUnit}`" class="vehicle-img">
        </div>
        <div class="vehicle-info">
          <span class="unit-number">U-{{ value.numberUnit }}</span>
          <span class="unit-brand">{{ value.carBrand }} {{ value.model }}</span>
          <span :class="['status-badge', `status-${value.status}`]">{{ statusLabel(value.status) }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getTypeVehicles } from '@/components/scripts/getVehicles';
import { getVehicleThumbnail } from '@/utils/imageLoader';
export default {
  name: 'allVehiclesByType',
  data() {
    return {
      stockVehicle: [],
      operativa: 'operativa',
      filterOptions: [
        { value: 'operativa', label: 'Operativas', color: 'green' },
        { value: 'taller', label: 'Taller', color: 'orange' },
        { value: 'in-operativa', label: 'Inoperativas', color: 'red' },
        { value: 'todas', label: 'Todas', color: 'blue' },
      ]
    }
  },
  methods: {
    getVehicleThumbnail,
    async loadVehicles(vehicleType) {
      this.stockVehicle = await getTypeVehicles(vehicleType, this.operativa);
    },
    async onStatusChange() {
      await this.loadVehicles(this.$route.params.type);
    },
    statusLabel(status) {
      return { 'operativa': 'Operativa', 'taller': 'En taller', 'in-operativa': 'Inoperativa' }[status] || status;
    }
  },
  async mounted() {
    await this.loadVehicles(this.$route.params.type);
  }
}
</script>

<style scoped>
.all-vehicles-view {
  padding-top: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.view-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.back-link {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  text-decoration: none;
  letter-spacing: 0.1em;
  padding: 4px 0;
  transition: color 0.2s;
  white-space: nowrap;
}

.back-link:hover { color: var(--accent-primary); }

.section-tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--accent-primary);
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 4px;
}

.view-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.filter-buttons {
  display: flex;
  gap: 4px;
}

.filter-btn {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 6px 14px;
  border-radius: var(--radius);
  border: 1px solid var(--border-subtle);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover { color: var(--text-primary); border-color: var(--text-muted); }
.filter-btn--active { font-weight: 700; }
.filter-btn--green { background: rgba(46,196,182,0.12); color: var(--accent-green); border-color: rgba(46,196,182,0.3); }
.filter-btn--orange { background: rgba(255,140,0,0.12); color: var(--accent-primary); border-color: rgba(255,140,0,0.3); }
.filter-btn--red { background: rgba(230,57,70,0.12); color: var(--accent-red); border-color: rgba(230,57,70,0.3); }
.filter-btn--blue { background: rgba(46,127,255,0.12); color: var(--accent-blue); border-color: rgba(46,127,255,0.3); }

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
}

.empty-icon { font-size: 2.5rem; }

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  overflow-y: auto;
  flex: 1;
}

.vehicle-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  text-decoration: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  max-height: 240px;
}

.vehicle-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.vehicle-img-wrap {
  flex: 1;
  background: #1a1a1c;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  overflow: hidden;
}

.vehicle-img {
  max-height: 140px;
  max-width: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.vehicle-card:hover .vehicle-img { transform: scale(1.06); }

.vehicle-info {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border-top: 1px solid var(--border-subtle);
}

.unit-number {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.1em;
}

.unit-brand {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 2px;
  align-self: flex-start;
  margin-top: 4px;
}

.status-operativa { background: rgba(46,196,182,0.12); color: var(--accent-green); border: 1px solid rgba(46,196,182,0.3); }
.status-taller { background: rgba(255,140,0,0.12); color: var(--accent-primary); border: 1px solid rgba(255,140,0,0.3); }
.status-in-operativa { background: rgba(230,57,70,0.12); color: var(--accent-red); border: 1px solid rgba(230,57,70,0.3); }
</style>
