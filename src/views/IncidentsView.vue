<template>
  <div class="incidents-view">
    <header class="view-header">
      <div class="header-content">
        <span class="section-tag">// GESTIÓN DE INCIDENTES</span>
        <h1 class="view-title">Control de Incidentes</h1>
      </div>
      <div class="header-actions">
        <button class="action-btn primary" @click="showNewIncident = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Incidente
        </button>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-icon active-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        </div>
        <div class="summary-data">
          <span class="summary-value">{{ activeCount }}</span>
          <span class="summary-label">Activos</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon route-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="summary-data">
          <span class="summary-value">{{ enRouteCount }}</span>
          <span class="summary-label">En Ruta</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon attending-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
        </div>
        <div class="summary-data">
          <span class="summary-value">{{ attendingCount }}</span>
          <span class="summary-label">Atendiendo</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon closed-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div class="summary-data">
          <span class="summary-value">{{ closedTodayCount }}</span>
          <span class="summary-label">Cerrados Hoy</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon time-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <div class="summary-data">
          <span class="summary-value">{{ avgResponseTime }}<small>min</small></span>
          <span class="summary-label">Resp. Promedio</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-tabs">
        <button 
          v-for="tab in statusTabs" 
          :key="tab.value"
          class="filter-tab"
          :class="{ 'is-active': activeStatus === tab.value }"
          @click="activeStatus = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="filter-group">
        <select v-model="activeType" class="filter-select">
          <option value="todos">Todos los tipos</option>
          <option value="incendio">Incendio</option>
          <option value="rescate">Rescate</option>
          <option value="emergencia_medica">Emergencia Médica</option>
          <option value="hazmat">HAZMAT</option>
          <option value="servicio">Servicio</option>
        </select>
      </div>
    </div>

    <!-- Incidents List -->
    <div class="incidents-grid">
      <div 
        v-for="incident in filteredIncidents" 
        :key="incident.id"
        class="incident-card"
        :class="'status-' + incident.status"
        @click="selectedIncident = incident"
      >
        <div class="incident-header">
          <div class="incident-id">
            <span class="id-hash">#</span>{{ incident.id }}
          </div>
          <div class="incident-badges">
            <span class="priority-badge" :class="'priority-' + incident.priority">{{ incident.priority }}</span>
            <span class="status-badge" :class="'status-' + incident.status">{{ getStatusLabel(incident.status) }}</span>
          </div>
        </div>

        <div class="incident-type">
          <span class="type-icon" v-html="getIncidentTypeIcon(incident.type)"></span>
          <span class="type-label">{{ getTypeLabel(incident.type) }}</span>
          <span v-if="incident.subtype" class="subtype-label">· {{ incident.subtype }}</span>
        </div>

        <p class="incident-description">{{ incident.description }}</p>

        <div class="incident-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ incident.location.address }}
        </div>

        <div class="incident-meta">
          <div class="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ formatTime(incident.reportedAt) }}
          </div>
          <div class="meta-item" v-if="incident.responseTime">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            {{ incident.responseTime }} min resp.
          </div>
        </div>

        <div class="incident-units" v-if="incident.assignedUnits.length">
          <span v-for="unit in incident.assignedUnits" :key="unit" class="unit-tag">{{ unit }}</span>
        </div>
      </div>

      <div v-if="filteredIncidents.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        </svg>
        <span class="empty-title">Sin incidentes</span>
        <span class="empty-subtitle">No hay incidentes con los filtros seleccionados</span>
      </div>
    </div>

    <!-- Incident Detail Modal -->
    <transition name="modal">
      <div v-if="selectedIncident" class="modal-overlay" @click.self="selectedIncident = null">
        <div class="modal-content">
          <button class="modal-close" @click="selectedIncident = null">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="modal-header">
            <div class="modal-id">#{{ selectedIncident.id }}</div>
            <div class="modal-badges">
              <span class="priority-badge" :class="'priority-' + selectedIncident.priority">{{ selectedIncident.priority }}</span>
              <span class="status-badge" :class="'status-' + selectedIncident.status">{{ getStatusLabel(selectedIncident.status) }}</span>
            </div>
          </div>

          <div class="modal-type">
            <span class="type-icon lg" v-html="getIncidentTypeIcon(selectedIncident.type)"></span>
            <div>
              <span class="type-label lg">{{ getTypeLabel(selectedIncident.type) }}</span>
              <span v-if="selectedIncident.subtype" class="subtype-label lg">{{ selectedIncident.subtype }}</span>
            </div>
          </div>

          <p class="modal-description">{{ selectedIncident.description }}</p>

          <div class="modal-section">
            <h4 class="section-title">Ubicación</h4>
            <div class="location-display">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ selectedIncident.location.address }}
            </div>
          </div>

          <div class="modal-section">
            <h4 class="section-title">Línea de Tiempo</h4>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div class="timeline-content">
                  <span class="timeline-label">Reportado</span>
                  <span class="timeline-time">{{ formatDateTime(selectedIncident.reportedAt) }}</span>
                </div>
              </div>
              <div class="timeline-item" v-if="selectedIncident.dispatchedAt">
                <span class="timeline-dot"></span>
                <div class="timeline-content">
                  <span class="timeline-label">Despachado</span>
                  <span class="timeline-time">{{ formatDateTime(selectedIncident.dispatchedAt) }}</span>
                </div>
              </div>
              <div class="timeline-item" v-if="selectedIncident.arrivedAt">
                <span class="timeline-dot"></span>
                <div class="timeline-content">
                  <span class="timeline-label">Llegada a escena</span>
                  <span class="timeline-time">{{ formatDateTime(selectedIncident.arrivedAt) }}</span>
                </div>
              </div>
              <div class="timeline-item" v-if="selectedIncident.closedAt">
                <span class="timeline-dot closed"></span>
                <div class="timeline-content">
                  <span class="timeline-label">Cerrado</span>
                  <span class="timeline-time">{{ formatDateTime(selectedIncident.closedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-section" v-if="selectedIncident.assignedUnits.length">
            <h4 class="section-title">Unidades Asignadas</h4>
            <div class="units-list">
              <span v-for="unit in selectedIncident.assignedUnits" :key="unit" class="unit-chip">{{ unit }}</span>
            </div>
          </div>

          <div class="modal-section" v-if="selectedIncident.notes.length">
            <h4 class="section-title">Notas</h4>
            <div class="notes-list">
              <div v-for="(note, idx) in selectedIncident.notes" :key="idx" class="note-item">
                <div class="note-header">
                  <span class="note-author">{{ note.author }}</span>
                  <span class="note-time">{{ formatDateTime(note.time) }}</span>
                </div>
                <p class="note-text">{{ note.text }}</p>
              </div>
            </div>
          </div>

          <div class="modal-section" v-if="selectedIncident.resources">
            <h4 class="section-title">Recursos Utilizados</h4>
            <div class="resources-grid">
              <div class="resource-item" v-if="selectedIncident.resources.waterUsed">
                <span class="resource-value">{{ selectedIncident.resources.waterUsed.toLocaleString() }}</span>
                <span class="resource-label">Litros de agua</span>
              </div>
              <div class="resource-item" v-if="selectedIncident.resources.foamUsed">
                <span class="resource-value">{{ selectedIncident.resources.foamUsed }}</span>
                <span class="resource-label">Litros de espuma</span>
              </div>
            </div>
            <div class="equipment-list" v-if="selectedIncident.resources.equipmentUsed?.length">
              <span class="equipment-label">Equipo:</span>
              <span v-for="eq in selectedIncident.resources.equipmentUsed" :key="eq" class="equipment-tag">{{ eq }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getIncidents, getIncidentTypeLabel, getIncidentStatusLabel, getIncidentTypeIcon } from '@/components/scripts/getIncidents.js'

export default {
  name: 'IncidentsView',
  data() {
    return {
      incidents: [],
      selectedIncident: null,
      showNewIncident: false,
      activeStatus: 'todos',
      activeType: 'todos',
      statusTabs: [
        { label: 'Todos', value: 'todos' },
        { label: 'Activos', value: 'activo' },
        { label: 'En Ruta', value: 'en_ruta' },
        { label: 'Atendiendo', value: 'atendiendo' },
        { label: 'Cerrados', value: 'cerrado' }
      ]
    }
  },
  computed: {
    filteredIncidents() {
      let result = this.incidents
      if (this.activeStatus !== 'todos') {
        result = result.filter(i => i.status === this.activeStatus)
      }
      if (this.activeType !== 'todos') {
        result = result.filter(i => i.type === this.activeType)
      }
      return result
    },
    activeCount() {
      return this.incidents.filter(i => i.status === 'activo').length
    },
    enRouteCount() {
      return this.incidents.filter(i => i.status === 'en_ruta').length
    },
    attendingCount() {
      return this.incidents.filter(i => i.status === 'atendiendo').length
    },
    closedTodayCount() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return this.incidents.filter(i => i.status === 'cerrado' && i.closedAt && new Date(i.closedAt) >= today).length
    },
    avgResponseTime() {
      const withResponse = this.incidents.filter(i => i.responseTime)
      if (!withResponse.length) return 0
      const sum = withResponse.reduce((acc, i) => acc + i.responseTime, 0)
      return (sum / withResponse.length).toFixed(1)
    }
  },
  async mounted() {
    this.incidents = await getIncidents()
  },
  methods: {
    getTypeLabel: getIncidentTypeLabel,
    getStatusLabel: getIncidentStatusLabel,
    getIncidentTypeIcon,
    formatTime(date) {
      return new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    },
    formatDateTime(date) {
      return new Date(date).toLocaleString('es-MX', { 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }
}
</script>

<style scoped>
.incidents-view {
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

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
}
.action-btn.primary {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}
.action-btn.primary:hover {
  background: var(--accent-secondary);
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.summary-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
}
.active-icon { background: rgba(239,68,68,0.12); color: var(--accent-red); }
.route-icon { background: rgba(59,130,246,0.12); color: var(--accent-blue); }
.attending-icon { background: rgba(249,115,22,0.12); color: var(--accent-orange); }
.closed-icon { background: rgba(34,197,94,0.12); color: var(--accent-green); }
.time-icon { background: rgba(245,158,11,0.12); color: var(--accent-amber); }

.summary-data {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
}
.summary-value small {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-left: 2px;
}

.summary-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Filters */
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-card);
  padding: 4px;
  border-radius: var(--radius);
  border: 1px solid var(--border-subtle);
}

.filter-tab {
  padding: 6px 14px;
  background: transparent;
  border: none;
  border-radius: var(--radius);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
}
.filter-tab:hover { color: var(--text-secondary); }
.filter-tab.is-active {
  background: rgba(220,38,38,0.15);
  color: var(--accent-secondary);
}

.filter-select {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 8px 12px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  cursor: pointer;
}

/* Incidents Grid */
.incidents-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  align-content: start;
}

.incident-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  overflow: hidden;
}
.incident-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}
.incident-card.status-activo::before { background: var(--accent-red); }
.incident-card.status-en_ruta::before { background: var(--accent-blue); }
.incident-card.status-atendiendo::before { background: var(--accent-orange); }
.incident-card.status-cerrado::before { background: var(--accent-green); }

.incident-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-accent);
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.incident-id {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}
.id-hash { color: var(--accent-secondary); }

.incident-badges {
  display: flex;
  gap: 6px;
}

.priority-badge,
.status-badge {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  padding: 2px 8px;
  border-radius: 2px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.priority-alta { background: rgba(239,68,68,0.15); color: var(--accent-red); }
.priority-media { background: rgba(245,158,11,0.15); color: var(--accent-amber); }
.priority-baja { background: rgba(139,146,165,0.15); color: var(--text-secondary); }

.status-activo { background: rgba(239,68,68,0.15); color: var(--accent-red); }
.status-en_ruta { background: rgba(59,130,246,0.15); color: var(--accent-blue); }
.status-atendiendo { background: rgba(249,115,22,0.15); color: var(--accent-orange); }
.status-cerrado { background: rgba(34,197,94,0.15); color: var(--accent-green); }

.incident-type {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.type-icon {
  color: var(--accent-secondary);
}

.type-label {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.subtype-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.incident-description {
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.incident-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.incident-meta {
  display: flex;
  gap: 14px;
  margin-bottom: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
}

.incident-units {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.unit-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  padding: 3px 8px;
  background: rgba(220,38,38,0.1);
  border: 1px solid rgba(220,38,38,0.2);
  border-radius: 2px;
  color: var(--accent-secondary);
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
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
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
  transition: all 0.15s;
}
.modal-close:hover {
  color: var(--text-primary);
  border-color: var(--border-accent);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-id {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-secondary);
}

.modal-badges {
  display: flex;
  gap: 8px;
}

.modal-type {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.type-icon.lg { transform: scale(1.3); }
.type-label.lg { font-size: 1rem; }
.subtype-label.lg { font-size: 0.85rem; display: block; }

.modal-description {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-section {
  margin-bottom: 20px;
}

.section-title {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 10px 0;
}

.location-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-primary);
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 12px;
  border-left: 2px solid var(--border-subtle);
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-primary);
  border: 2px solid var(--bg-secondary);
  position: absolute;
  left: -18px;
  top: 2px;
}
.timeline-dot.closed { background: var(--accent-green); }

.timeline-content {
  display: flex;
  flex-direction: column;
}

.timeline-label {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--text-primary);
}

.timeline-time {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
}

.units-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.unit-chip {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 6px 12px;
  background: rgba(220,38,38,0.1);
  border: 1px solid rgba(220,38,38,0.25);
  border-radius: var(--radius);
  color: var(--accent-secondary);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-item {
  background: var(--bg-card);
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border-subtle);
}

.note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.note-author {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

.note-time {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
}

.note-text {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.resource-item {
  background: var(--bg-card);
  padding: 12px;
  border-radius: var(--radius);
  text-align: center;
}

.resource-value {
  display: block;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-secondary);
}

.resource-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.equipment-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.equipment-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
}

.equipment-tag {
  font-family: var(--font-body);
  font-size: 0.72rem;
  padding: 4px 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-secondary);
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.empty-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-top: 16px;
}

.empty-subtitle {
  font-family: var(--font-body);
  font-size: 0.82rem;
  margin-top: 4px;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
