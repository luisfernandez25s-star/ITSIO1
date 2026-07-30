<template>
  <div class="dispatch-view">
    <header class="view-header">
      <div class="header-content">
        <span class="section-tag">// CENTRO DE DESPACHO</span>
        <h1 class="view-title">Sistema de Despacho</h1>
      </div>
      <div class="header-status">
        <div class="guard-indicator">
          <span class="guard-label">GUARDIA ACTIVA:</span>
          <select v-model="currentGuard" @change="onGuardChange" class="guard-select-header">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <span class="guard-incidents">{{ guardIncidentsToday }} incidentes en jornada</span>
        </div>
        <div class="live-indicator">
          <span class="live-dot"></span>
          EN VIVO
        </div>
        <span class="time-display">{{ currentTime }}</span>
      </div>
    </header>

    <div class="dispatch-layout">
      <!-- Left Panel: Unit Status Board -->
      <div class="panel units-panel">
        <div class="panel-header">
          <h2 class="panel-title">Estado de Unidades</h2>
          <div class="unit-counts">
            <span class="count-item available">{{ availableCount }} Disponibles</span>
            <span class="count-item busy">{{ busyCount }} En Servicio</span>
          </div>
        </div>

        <div class="units-grid">
          <div 
            v-for="unit in units" 
            :key="unit.unitId"
            class="unit-card"
            :class="'status-' + unit.status"
            @click="selectUnit(unit)"
          >
            <div class="unit-header">
              <span class="unit-id">{{ unit.unitId }}</span>
              <span class="unit-type">{{ unit.type }}</span>
            </div>
            
            <div class="unit-status-badge" :class="'badge-' + unit.status">
              {{ getUnitStatusLabel(unit.status) }}
            </div>

            <div class="unit-info">
              <div class="info-row">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <span>{{ unit.crewCount }} tripulantes</span>
              </div>
              <div class="info-row location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ unit.location }}</span>
              </div>
            </div>

            <div v-if="unit.currentIncident" class="unit-incident">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              Incidente #{{ unit.currentIncident }}
            </div>

            <div class="unit-updated">
              Actualizado {{ formatTimeAgo(unit.lastUpdate) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Dispatch Queue -->
      <div class="panel queue-panel">
        <div class="panel-header">
          <h2 class="panel-title">Cola de Despacho</h2>
          <span class="queue-count">{{ dispatchQueue.length }} pendientes</span>
        </div>

        <div class="queue-list" v-if="dispatchQueue.length">
          <div 
            v-for="item in dispatchQueue" 
            :key="item.id"
            class="queue-item"
            :class="'priority-' + item.priority"
          >
            <div class="queue-header">
              <span class="queue-priority" :class="'priority-' + item.priority">{{ item.priority.toUpperCase() }}</span>
              <span class="queue-time">{{ formatTimeAgo(item.receivedAt) }}</span>
            </div>

            <div class="queue-type">
              <span class="type-icon" v-html="getIncidentTypeIcon(item.type)"></span>
              {{ getTypeLabel(item.type) }}
            </div>

            <div class="queue-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ item.location }}
            </div>

            <div class="queue-caller">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {{ item.caller }} - {{ item.phone }}
            </div>

            <div class="queue-status" :class="'status-' + item.status">
              {{ getDispatchStatusLabel(item.status) }}
            </div>

            <div class="queue-actions">
              <button class="dispatch-btn" @click="dispatchUnit(item)" :disabled="!availableUnits.length">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                Despachar
              </button>
            </div>
          </div>
        </div>

        <div v-else class="queue-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <span class="empty-title">Cola vacía</span>
          <span class="empty-subtitle">No hay incidentes pendientes de despacho</span>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats">
          <div class="stat-item stat-highlight">
            <span class="stat-value">{{ guardIncidentsToday }}</span>
            <span class="stat-label">Incidentes Guardia {{ currentGuard }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ avgDispatchTime }}</span>
            <span class="stat-label">Min prom. despacho</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ incidentsToday }}</span>
            <span class="stat-label">Incidentes hoy (total)</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ unitsInService }}</span>
            <span class="stat-label">Unidades activas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dispatch Modal -->
    <transition name="modal">
      <div v-if="showDispatchModal" class="modal-overlay" @click.self="showDispatchModal = false">
        <div class="modal-content dispatch-modal">
          <div class="modal-header">
            <h3 class="modal-title">Despachar Unidad</h3>
            <button class="modal-close" @click="showDispatchModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="dispatch-details" v-if="selectedQueueItem">
            <div class="detail-row">
              <span class="detail-label">Incidente:</span>
              <span class="detail-value">{{ getTypeLabel(selectedQueueItem.type) }} - {{ selectedQueueItem.location }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prioridad:</span>
              <span class="priority-badge" :class="'priority-' + selectedQueueItem.priority">{{ selectedQueueItem.priority }}</span>
            </div>
          </div>

          <div class="unit-selection">
            <h4 class="selection-title">Seleccionar Unidad</h4>
            <div class="available-units">
              <div 
                v-for="unit in availableUnits" 
                :key="unit.unitId"
                class="selectable-unit"
                :class="{ 'is-selected': selectedUnit?.unitId === unit.unitId }"
                @click="selectedUnit = unit"
              >
                <span class="unit-id">{{ unit.unitId }}</span>
                <span class="unit-type">{{ unit.type }}</span>
                <span class="unit-crew">{{ unit.crewCount }} trip.</span>
              </div>
            </div>
          </div>

          <div class="personnel-selection">
            <h4 class="selection-title">
              Personal Certificado - Guardia 
              <select v-model="selectedGuard" @change="loadPersonnelForGuard" class="guard-selector">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <span class="personnel-count">{{ certifiedPersonnel.length }} disponibles</span>
            </h4>
            <div class="certified-personnel-grid">
              <div 
                v-for="person in certifiedPersonnel" 
                :key="person.id"
                class="personnel-card"
                :class="{ 'is-selected': selectedPersonnel.includes(person.id) }"
                @click="togglePersonnel(person.id)"
              >
                <div class="personnel-avatar" :style="{ background: getAvatarColor(person.id) }">
                  {{ person.initials }}
                </div>
                <div class="personnel-info">
                  <span class="personnel-name">{{ person.name }}</span>
                  <span class="personnel-rank">{{ person.rank }}</span>
                </div>
                <div class="personnel-certs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  {{ person.totalCerts }} certs
                </div>
              </div>
            </div>
            <p v-if="!certifiedPersonnel.length" class="no-personnel">
              No hay personal con todas las certificaciones vigentes en la guardia actual
            </p>
          </div>

          <div class="modal-actions">
            <button class="cancel-btn" @click="showDispatchModal = false">Cancelar</button>
            <button class="confirm-btn" @click="confirmDispatch" :disabled="!selectedUnit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              Confirmar Despacho
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getDispatchQueue, getUnitStatus, getUnitStatusLabel, getDispatchStatusLabel, getAvailableUnits, getCurrentGuard, getCertifiedPersonnelForDispatch } from '@/components/scripts/getDispatch.js'
import { getIncidentTypeIcon, getIncidentTypeLabel } from '@/components/scripts/getIncidents.js'

export default {
  name: 'DispatchView',
  data() {
    return {
      units: [],
      dispatchQueue: [],
      certifiedPersonnel: [],
      selectedPersonnel: [],
      currentGuard: '',
      selectedGuard: '',
      currentTime: '',
      timer: null,
      showDispatchModal: false,
      selectedQueueItem: null,
      selectedUnit: null,
      avgDispatchTime: 3.2,
      incidentsToday: 12,
      guardIncidentsData: {
        'A': 4,
        'B': 3,
        'C': 3,
        'D': 2
      },
      allPersonnel: [
        { id: 1, name: 'Cap. Jorge Garcia', guard: 'A', rank: 'Capitan', initials: 'JG', allCertsValid: true, totalCerts: 8 },
        { id: 2, name: 'Tte. Roberto Sanchez', guard: 'A', rank: 'Teniente', initials: 'RS', allCertsValid: false, totalCerts: 6 },
        { id: 3, name: 'Bro. Carlos Mendez', guard: 'B', rank: 'Bombero', initials: 'CM', allCertsValid: true, totalCerts: 4 },
        { id: 4, name: 'Bro. Luis Hernandez', guard: 'B', rank: 'Bombero', initials: 'LH', allCertsValid: false, totalCerts: 4 },
        { id: 5, name: 'Bro. Pedro Ramirez', guard: 'C', rank: 'Bombero', initials: 'PR', allCertsValid: true, totalCerts: 5 },
        { id: 6, name: 'Bro. Ana Lopez', guard: 'C', rank: 'Bombero', initials: 'AL', allCertsValid: true, totalCerts: 4 },
        { id: 7, name: 'Bro. Miguel Torres', guard: 'D', rank: 'Bombero', initials: 'MT', allCertsValid: true, totalCerts: 4 },
        { id: 8, name: 'Bro. Sofia Ruiz', guard: 'D', rank: 'Bombero', initials: 'SR', allCertsValid: false, totalCerts: 3 },
        { id: 9, name: 'Tte. Andres Molina', guard: 'A', rank: 'Teniente', initials: 'AM', allCertsValid: true, totalCerts: 6 },
        { id: 10, name: 'Bro. Ivan Reyes', guard: 'A', rank: 'Bombero', initials: 'IR', allCertsValid: true, totalCerts: 4 },
        { id: 11, name: 'Bro. Gabriel Moreno', guard: 'B', rank: 'Bombero', initials: 'GM', allCertsValid: true, totalCerts: 5 },
        { id: 12, name: 'Bro. Hector Vargas', guard: 'B', rank: 'Bombero', initials: 'HV', allCertsValid: true, totalCerts: 4 },
        { id: 13, name: 'Bro. Eduardo Diaz', guard: 'C', rank: 'Bombero', initials: 'ED', allCertsValid: true, totalCerts: 5 },
        { id: 14, name: 'Bro. Fernando Castro', guard: 'C', rank: 'Bombero', initials: 'FC', allCertsValid: true, totalCerts: 4 },
        { id: 15, name: 'Bro. Leonardo Ruiz', guard: 'D', rank: 'Bombero', initials: 'LR', allCertsValid: true, totalCerts: 4 },
        { id: 16, name: 'Bro. Manuel Santos', guard: 'D', rank: 'Bombero', initials: 'MS', allCertsValid: true, totalCerts: 5 }
      ]
    }
  },
  computed: {
    availableUnits() {
      return this.units.filter(u => u.status === 'disponible')
    },
    availableCount() {
      return this.availableUnits.length
    },
    busyCount() {
      return this.units.filter(u => ['en_ruta', 'en_escena', 'atendiendo', 'regresando'].includes(u.status)).length
    },
    unitsInService() {
      return this.busyCount
    },
    guardIncidentsToday() {
      return this.guardIncidentsData[this.currentGuard] || 0
    }
  },
  async mounted() {
    await this.loadData()
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    getUnitStatusLabel,
    getDispatchStatusLabel,
    getIncidentTypeIcon,
    getTypeLabel: getIncidentTypeLabel,
    async loadData() {
      this.units = await getUnitStatus()
      this.dispatchQueue = await getDispatchQueue()
      this.currentGuard = getCurrentGuard()
      this.selectedGuard = this.currentGuard
      this.loadPersonnelForGuard()
    },
    loadPersonnelForGuard() {
      // Clear selected personnel when changing guards
      this.selectedPersonnel = []
      // Filter personnel by the selected guard and only those with all certifications valid
      this.certifiedPersonnel = this.allPersonnel.filter(p => p.guard === this.selectedGuard && p.allCertsValid)
    },
    onGuardChange() {
      // When the main guard changes, also update the selected guard for personnel
      this.selectedGuard = this.currentGuard
      this.loadPersonnelForGuard()
    },
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    },
    formatTimeAgo(date) {
      const now = new Date()
      const diff = now - new Date(date)
      const minutes = Math.floor(diff / 60000)
      if (minutes < 1) return 'ahora'
      if (minutes < 60) return `hace ${minutes} min`
      const hours = Math.floor(minutes / 60)
      return `hace ${hours}h`
    },
    selectUnit(unit) {
      this.selectedUnit = unit
    },
    dispatchUnit(item) {
      this.selectedQueueItem = item
      this.selectedUnit = null
      this.selectedPersonnel = []
      this.showDispatchModal = true
    },
    togglePersonnel(personId) {
      const idx = this.selectedPersonnel.indexOf(personId)
      if (idx > -1) {
        this.selectedPersonnel.splice(idx, 1)
      } else {
        this.selectedPersonnel.push(personId)
      }
    },
    getAvatarColor(id) {
      const colors = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#4f46e5', '#be185d']
      return colors[id % colors.length]
    },
    confirmDispatch() {
      if (!this.selectedUnit || !this.selectedQueueItem) return
      
      // Update unit status
      const unit = this.units.find(u => u.unitId === this.selectedUnit.unitId)
      if (unit) {
        unit.status = 'en_ruta'
        unit.currentIncident = this.selectedQueueItem.incidentId
        unit.lastUpdate = new Date()
      }
      
      // Update queue item
      this.selectedQueueItem.status = 'en_ruta'
      
      // Increment incidents count for the current guard
      this.guardIncidentsData[this.currentGuard]++
      this.incidentsToday++
      
      this.showDispatchModal = false
      this.selectedUnit = null
      this.selectedQueueItem = null
      this.selectedPersonnel = []
    }
  }
}
</script>

<style scoped>
.dispatch-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
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

.header-status {
  display: flex;
  align-items: center;
  gap: 16px;
}

.guard-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(220,38,38,0.08);
  border: 1px solid rgba(220,38,38,0.25);
  border-radius: var(--radius);
}

.guard-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.guard-select-header {
  background: transparent;
  border: 1px solid rgba(220,38,38,0.4);
  border-radius: 3px;
  padding: 2px 8px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-secondary);
  cursor: pointer;
}
.guard-select-header:focus { outline: none; }
.guard-select-header option { background: var(--bg-card); color: var(--text-primary); }

.guard-incidents {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--accent-secondary);
  letter-spacing: 0.05em;
  padding-left: 8px;
  border-left: 1px solid rgba(220,38,38,0.3);
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--accent-red);
  letter-spacing: 0.12em;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-red);
  animation: pulse-live 1.5s ease-in-out infinite;
}
@keyframes pulse-live {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.time-display {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--accent-secondary);
  letter-spacing: 0.1em;
}

/* Layout */
.dispatch-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.panel {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.panel-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.unit-counts {
  display: flex;
  gap: 12px;
}

.count-item {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  padding: 4px 10px;
  border-radius: 2px;
  letter-spacing: 0.08em;
}
.count-item.available { background: rgba(34,197,94,0.12); color: var(--accent-green); }
.count-item.busy { background: rgba(249,115,22,0.12); color: var(--accent-orange); }

.queue-count {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
}

/* Units Grid */
.units-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.unit-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 12px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}
.unit-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 3px 0 0 3px;
}
.unit-card.status-disponible::before { background: var(--accent-green); }
.unit-card.status-en_ruta::before { background: var(--accent-blue); }
.unit-card.status-en_escena::before,
.unit-card.status-atendiendo::before { background: var(--accent-orange); }
.unit-card.status-regresando::before { background: var(--accent-amber); }
.unit-card.status-fuera_servicio::before { background: var(--text-muted); }

.unit-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-accent);
}

.unit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.unit-id {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
}

.unit-type {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.unit-status-badge {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  padding: 3px 8px;
  border-radius: 2px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
  display: inline-block;
}
.badge-disponible { background: rgba(34,197,94,0.15); color: var(--accent-green); }
.badge-en_ruta { background: rgba(59,130,246,0.15); color: var(--accent-blue); }
.badge-en_escena,
.badge-atendiendo { background: rgba(249,115,22,0.15); color: var(--accent-orange); }
.badge-regresando { background: rgba(245,158,11,0.15); color: var(--accent-amber); }
.badge-fuera_servicio { background: rgba(139,146,165,0.15); color: var(--text-muted); }

.unit-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--text-secondary);
}
.info-row.location {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.unit-incident {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--accent-orange);
  margin-bottom: 6px;
}

.unit-updated {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-muted);
}

/* Queue Panel */
.queue-panel {
  display: flex;
  flex-direction: column;
}

.queue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.queue-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 14px;
  position: relative;
}
.queue-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 3px 0 0 3px;
}
.queue-item.priority-alta::before { background: var(--accent-red); }
.queue-item.priority-media::before { background: var(--accent-amber); }
.queue-item.priority-baja::before { background: var(--text-muted); }

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.queue-priority {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  padding: 2px 8px;
  border-radius: 2px;
  letter-spacing: 0.1em;
}
.queue-priority.priority-alta { background: rgba(239,68,68,0.15); color: var(--accent-red); }
.queue-priority.priority-media { background: rgba(245,158,11,0.15); color: var(--accent-amber); }
.queue-priority.priority-baja { background: rgba(139,146,165,0.15); color: var(--text-muted); }

.queue-time {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
}

.queue-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.type-icon {
  color: var(--accent-secondary);
}

.queue-location,
.queue-caller {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.queue-status {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  padding: 3px 8px;
  border-radius: 2px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 10px;
}
.queue-status.status-pendiente { background: rgba(239,68,68,0.12); color: var(--accent-red); }
.queue-status.status-asignado { background: rgba(59,130,246,0.12); color: var(--accent-blue); }
.queue-status.status-en_ruta { background: rgba(34,197,94,0.12); color: var(--accent-green); }

.queue-actions {
  display: flex;
  gap: 8px;
}

.dispatch-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--accent-primary);
  border: none;
  border-radius: var(--radius);
  color: white;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
}
.dispatch-btn:hover:not(:disabled) { background: var(--accent-secondary); }
.dispatch-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.queue-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-muted);
  flex: 1;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-top: 12px;
}

.empty-subtitle {
  font-family: var(--font-body);
  font-size: 0.75rem;
  margin-top: 4px;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border-subtle);
  border-top: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.stat-item {
  background: var(--bg-card);
  padding: 12px;
  text-align: center;
}

.stat-item.stat-highlight {
  background: rgba(220,38,38,0.08);
  border-left: 2px solid var(--accent-secondary);
}
.stat-item.stat-highlight .stat-value {
  color: var(--accent-secondary);
  font-size: 1.4rem;
}
.stat-item.stat-highlight .stat-label {
  color: var(--accent-secondary);
}

.stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-secondary);
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 480px;
  padding: 24px;
}

.dispatch-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
}

.dispatch-details {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.detail-row:last-child { margin-bottom: 0; }

.detail-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  width: 80px;
}

.detail-value {
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--text-primary);
}

.priority-badge {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  padding: 2px 8px;
  border-radius: 2px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.priority-badge.priority-alta { background: rgba(239,68,68,0.15); color: var(--accent-red); }
.priority-badge.priority-media { background: rgba(245,158,11,0.15); color: var(--accent-amber); }
.priority-badge.priority-baja { background: rgba(139,146,165,0.15); color: var(--text-muted); }

.unit-selection {
  margin-bottom: 20px;
}

.selection-title {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 12px 0;
}

.available-units {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.selectable-unit {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
}
.selectable-unit:hover {
  border-color: var(--border-accent);
}
.selectable-unit.is-selected {
  background: rgba(220,38,38,0.1);
  border-color: var(--accent-primary);
}

.selectable-unit .unit-id {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}

.selectable-unit .unit-type {
  flex: 1;
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.selectable-unit .unit-crew {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
}

.cancel-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}
.cancel-btn:hover { border-color: var(--border-accent); }

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--accent-primary);
  border: none;
  color: white;
}
.confirm-btn:hover:not(:disabled) { background: var(--accent-secondary); }
.confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Personnel Selection */
.personnel-selection {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

.selection-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  gap: 8px;
}

.guard-selector {
  padding: 4px 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius);
  color: var(--accent-secondary);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
.guard-selector:focus { outline: none; border-color: var(--accent-secondary); }
.guard-selector option { background: var(--bg-card); color: var(--text-primary); }

.personnel-count {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--accent-green);
  background: rgba(34,197,94,0.1);
  padding: 4px 8px;
  border-radius: var(--radius);
}

.certified-personnel-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.personnel-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
}

.personnel-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-accent);
}

.personnel-card.is-selected {
  background: rgba(34,197,94,0.1);
  border-color: var(--accent-green);
}

.personnel-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.personnel-info {
  flex: 1;
  min-width: 0;
}

.personnel-name {
  display: block;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.personnel-rank {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-secondary);
}

.personnel-certs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--accent-green);
}

.no-personnel {
  text-align: center;
  padding: 20px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
