<template>
  <div class="maintenance-log">
    <div class="log-header">
      <div class="log-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['log-tab', { 'log-tab--active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon" v-html="tab.icon"></span>
          {{ tab.label }}
          <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
      <button class="add-btn" @click="showAddModal = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nuevo Registro
      </button>
    </div>

    <!-- Maintenance Records -->
    <div v-if="activeTab === 'maintenance'" class="records-list">
      <div v-for="record in maintenanceRecords" :key="record.id" class="record-card">
        <div :class="['record-status', `record-status--${record.status}`]"></div>
        <div class="record-main">
          <div class="record-header">
            <span class="record-type">{{ record.type }}</span>
            <span :class="['record-badge', `record-badge--${record.status}`]">{{ statusLabels[record.status] }}</span>
          </div>
          <p class="record-desc">{{ record.description }}</p>
          <div class="record-meta">
            <span class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ record.date }}
            </span>
            <span class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {{ record.technician }}
            </span>
            <span v-if="record.cost" class="meta-item meta-item--cost">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              ${{ record.cost.toLocaleString() }}
            </span>
          </div>
        </div>
        <div class="record-actions">
          <button class="action-btn" title="Ver detalles">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="action-btn" title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Incidents Records -->
    <div v-if="activeTab === 'incidents'" class="records-list">
      <div v-for="incident in incidentRecords" :key="incident.id" class="record-card record-card--incident">
        <div :class="['record-status', `record-status--${incident.severity}`]"></div>
        <div class="record-main">
          <div class="record-header">
            <span class="record-type">{{ incident.type }}</span>
            <span :class="['severity-badge', `severity-badge--${incident.severity}`]">{{ severityLabels[incident.severity] }}</span>
          </div>
          <p class="record-desc">{{ incident.description }}</p>
          <div class="record-meta">
            <span class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ incident.date }}
            </span>
            <span class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {{ incident.reportedBy }}
            </span>
            <span v-if="incident.resolved" class="meta-item meta-item--resolved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Resuelto
            </span>
          </div>
        </div>
        <div class="record-actions">
          <button class="action-btn" title="Ver detalles">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button v-if="!incident.resolved" class="action-btn action-btn--resolve" title="Marcar resuelto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Scheduled Maintenance -->
    <div v-if="activeTab === 'scheduled'" class="records-list">
      <div v-for="sched in scheduledMaintenance" :key="sched.id" class="scheduled-card">
        <div class="sched-date">
          <span class="sched-day">{{ sched.day }}</span>
          <span class="sched-month">{{ sched.month }}</span>
        </div>
        <div class="sched-info">
          <span class="sched-type">{{ sched.type }}</span>
          <span class="sched-desc">{{ sched.description }}</span>
        </div>
        <div :class="['sched-priority', `sched-priority--${sched.priority}`]">{{ sched.priority.toUpperCase() }}</div>
      </div>
    </div>

    <!-- Add Record Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Nuevo Registro</h3>
          <button class="modal-close" @click="showAddModal = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Tipo de Registro</label>
            <select v-model="newRecord.recordType">
              <option value="maintenance">Mantenimiento</option>
              <option value="incident">Incidente</option>
            </select>
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select v-model="newRecord.category">
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
              <option value="emergencia">Emergencia</option>
            </select>
          </div>
          <div class="form-group">
            <label>Descripcion</label>
            <textarea v-model="newRecord.description" rows="3" placeholder="Describa el trabajo realizado o incidente..."></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Fecha</label>
              <input type="date" v-model="newRecord.date">
            </div>
            <div class="form-group">
              <label>Costo (MXN)</label>
              <input type="number" v-model="newRecord.cost" placeholder="0.00">
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showAddModal = false">Cancelar</button>
          <button class="btn-save" @click="saveRecord">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaintenanceLogVehicle',
  props: {
    vehicleNumber: { type: [String, Number], required: true }
  },
  data() {
    return {
      activeTab: 'maintenance',
      showAddModal: false,
      newRecord: {
        recordType: 'maintenance',
        category: 'preventivo',
        description: '',
        date: '',
        cost: null
      },
      tabs: [
        { id: 'maintenance', label: 'Mantenimiento', count: 5, icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>` },
        { id: 'incidents', label: 'Incidentes', count: 2, icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
        { id: 'scheduled', label: 'Programados', count: 3, icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` }
      ],
      statusLabels: {
        completed: 'Completado',
        inProgress: 'En Proceso',
        pending: 'Pendiente'
      },
      severityLabels: {
        low: 'Bajo',
        medium: 'Medio',
        high: 'Alto',
        critical: 'Critico'
      },
      maintenanceRecords: [
        { id: 1, type: 'Cambio de Aceite', description: 'Cambio de aceite y filtros. Revision de niveles y sellos.', date: '25 May 2026', technician: 'Mec. Juan Perez', cost: 1850, status: 'completed' },
        { id: 2, type: 'Revision de Frenos', description: 'Inspeccion del sistema de frenos. Cambio de balatas delanteras.', date: '18 May 2026', technician: 'Mec. Roberto Luna', cost: 3200, status: 'completed' },
        { id: 3, type: 'Servicio de 50,000 km', description: 'Servicio mayor programado. Incluye revision completa de motor.', date: '10 May 2026', technician: 'Mec. Juan Perez', cost: 8500, status: 'completed' },
        { id: 4, type: 'Reparacion Sistema Electrico', description: 'Falla en luces de emergencia. Revision de cableado.', date: '28 May 2026', technician: 'Elec. Carlos Rios', cost: null, status: 'inProgress' },
        { id: 5, type: 'Calibracion de Bomba', description: 'Ajuste de presion y flujo del sistema de bomba de agua.', date: '30 May 2026', technician: 'Tec. Mario Vega', cost: null, status: 'pending' },
      ],
      incidentRecords: [
        { id: 1, type: 'Colision Menor', description: 'Golpe en defensa trasera durante maniobra de reversa en escena.', date: '15 May 2026', reportedBy: 'Bro. Carlos Mendez', severity: 'low', resolved: true },
        { id: 2, type: 'Falla Mecanica', description: 'Sobrecalentamiento del motor durante servicio prolongado.', date: '22 May 2026', reportedBy: 'Tte. Roberto Sanchez', severity: 'high', resolved: false },
      ],
      scheduledMaintenance: [
        { id: 1, day: '05', month: 'JUN', type: 'Servicio Preventivo', description: 'Revision general de motor y transmision', priority: 'alta' },
        { id: 2, day: '15', month: 'JUN', type: 'Verificacion Vehicular', description: 'Verificacion ambiental obligatoria', priority: 'media' },
        { id: 3, day: '01', month: 'JUL', type: 'Cambio de Llantas', description: 'Reemplazo programado de llantas traseras', priority: 'baja' },
      ]
    }
  },
  methods: {
    saveRecord() {
      console.log('[ITSIO] Saving record:', this.newRecord);
      this.showAddModal = false;
      this.newRecord = { recordType: 'maintenance', category: 'preventivo', description: '', date: '', cost: null };
    }
  }
}
</script>

<style scoped>
.maintenance-log { height: 100%; display: flex; flex-direction: column; overflow: hidden; }

.log-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.log-tabs { display: flex; gap: 4px; }

.log-tab {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: var(--radius);
  border: 1px solid transparent; background: transparent;
  color: var(--text-muted);
  font-family: var(--font-display); font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.log-tab:hover { color: var(--text-primary); background: var(--bg-card-hover); }
.log-tab--active {
  background: rgba(220,38,38,0.08);
  color: var(--accent-secondary);
  border-color: rgba(220,38,38,0.2);
}

.tab-icon { display: flex; }
.tab-count {
  font-family: var(--font-mono); font-size: 0.6rem;
  background: var(--bg-secondary); padding: 1px 5px;
  border-radius: 3px; color: var(--text-muted);
}

.add-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: var(--radius);
  border: 1px solid rgba(220,38,38,0.3); background: rgba(220,38,38,0.1);
  color: var(--accent-secondary);
  font-family: var(--font-display); font-size: 0.75rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.add-btn:hover { background: rgba(220,38,38,0.18); }

/* Records list */
.records-list { flex: 1; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }

.record-card {
  display: flex; gap: 12px; padding: 14px;
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); transition: all 0.2s;
}
.record-card:hover { border-color: var(--border-accent); }

.record-status { width: 3px; border-radius: 2px; flex-shrink: 0; }
.record-status--completed { background: var(--accent-green); }
.record-status--inProgress { background: var(--accent-amber); }
.record-status--pending { background: var(--text-muted); }
.record-status--low { background: var(--accent-green); }
.record-status--medium { background: var(--accent-amber); }
.record-status--high { background: var(--accent-orange); }
.record-status--critical { background: var(--accent-red); }

.record-main { flex: 1; display: flex; flex-direction: column; gap: 6px; }

.record-header { display: flex; align-items: center; justify-content: space-between; }
.record-type { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }

.record-badge, .severity-badge {
  font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.1em;
  padding: 2px 6px; border-radius: 2px;
}
.record-badge--completed { background: var(--accent-green-glow); color: var(--accent-green); }
.record-badge--inProgress { background: rgba(245,158,11,0.1); color: var(--accent-amber); }
.record-badge--pending { background: var(--bg-card); color: var(--text-muted); }

.severity-badge--low { background: var(--accent-green-glow); color: var(--accent-green); }
.severity-badge--medium { background: rgba(245,158,11,0.1); color: var(--accent-amber); }
.severity-badge--high { background: rgba(249,115,22,0.1); color: var(--accent-orange); }
.severity-badge--critical { background: rgba(239,68,68,0.1); color: var(--accent-red); }

.record-desc { font-family: var(--font-body); font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; }

.record-meta { display: flex; gap: 12px; flex-wrap: wrap; }
.meta-item {
  display: flex; align-items: center; gap: 4px;
  font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted);
}
.meta-item--cost { color: var(--accent-green); }
.meta-item--resolved { color: var(--accent-green); }

.record-actions { display: flex; flex-direction: column; gap: 4px; }
.action-btn {
  width: 28px; height: 28px; border-radius: var(--radius);
  border: 1px solid var(--border-subtle); background: var(--bg-card);
  color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.action-btn:hover { border-color: var(--border-accent); color: var(--text-primary); }
.action-btn--resolve:hover { border-color: var(--accent-green); color: var(--accent-green); }

/* Scheduled cards */
.scheduled-card {
  display: flex; align-items: center; gap: 14px; padding: 12px 14px;
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); transition: all 0.2s;
}
.scheduled-card:hover { border-color: var(--border-accent); }

.sched-date {
  display: flex; flex-direction: column; align-items: center;
  background: var(--bg-card); padding: 8px 12px; border-radius: var(--radius);
  border: 1px solid var(--border-subtle);
}
.sched-day { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: var(--text-primary); line-height: 1; }
.sched-month { font-family: var(--font-mono); font-size: 0.55rem; color: var(--accent-secondary); letter-spacing: 0.1em; }

.sched-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.sched-type { font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
.sched-desc { font-family: var(--font-body); font-size: 0.75rem; color: var(--text-secondary); }

.sched-priority {
  font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.1em;
  padding: 3px 8px; border-radius: 2px;
}
.sched-priority--alta { background: rgba(239,68,68,0.1); color: var(--accent-red); }
.sched-priority--media { background: rgba(245,158,11,0.1); color: var(--accent-amber); }
.sched-priority--baja { background: var(--accent-green-glow); color: var(--accent-green); }

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8); display: flex;
  align-items: center; justify-content: center; z-index: 1000;
}

.modal-content {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); width: 480px; max-width: 90vw;
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--border-subtle);
}
.modal-header h3 {
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  color: var(--text-primary); margin: 0;
}

.modal-close {
  background: none; border: none; color: var(--text-muted);
  cursor: pointer; padding: 4px; display: flex; transition: color 0.2s;
}
.modal-close:hover { color: var(--text-primary); }

.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }

.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label {
  font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.form-group select, .form-group input, .form-group textarea {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 8px 12px;
  font-family: var(--font-body); font-size: 0.85rem; color: var(--text-primary);
  outline: none; transition: border-color 0.2s;
}
.form-group select:focus, .form-group input:focus, .form-group textarea:focus {
  border-color: var(--accent-secondary);
}
.form-group textarea { resize: vertical; min-height: 80px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.modal-actions {
  display: flex; justify-content: flex-end; gap: 8px;
  padding: 16px 20px; border-top: 1px solid var(--border-subtle);
}

.btn-cancel, .btn-save {
  padding: 8px 16px; border-radius: var(--radius);
  font-family: var(--font-display); font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.btn-cancel {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}
.btn-cancel:hover { border-color: var(--border-accent); color: var(--text-primary); }
.btn-save {
  background: var(--accent-secondary); border: 1px solid var(--accent-secondary);
  color: white;
}
.btn-save:hover { background: #b91c1c; }
</style>
