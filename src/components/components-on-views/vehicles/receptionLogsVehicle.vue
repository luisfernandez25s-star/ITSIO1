<template>
  <div class="reception-logs">
    <!-- Checklist area -->
    <div class="checklist-area">
      <div class="checklist-scroll">
        <div
          v-for="section in sections"
          :key="section.title"
          class="checklist-section"
        >
          <div class="section-header" @click="section.open = !section.open">
            <span class="section-icon" v-html="section.icon"></span>
            <span class="section-title">{{ section.title }}</span>
            <span class="section-status">
              <span class="badge-count">{{ section.items.length }} items</span>
            </span>
            <span class="section-chevron" :class="{ open: section.open }">›</span>
          </div>
          <div v-if="section.open" class="section-items">
            <div v-for="item in section.items" :key="item" class="check-row">
              <span class="check-name">{{ item }}</span>
              <div class="check-options">
                <button
                  v-for="opt in ['Bueno', 'Malo', 'N/A']"
                  :key="opt"
                  class="check-opt"
                  :class="{
                    'check-opt--active-good': checkState[section.title+item] === opt && opt === 'Bueno',
                    'check-opt--active-bad': checkState[section.title+item] === opt && opt === 'Malo',
                    'check-opt--active-na': checkState[section.title+item] === opt && opt === 'N/A',
                  }"
                  @click="checkState[section.title+item] = opt"
                >{{ opt }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="reception-sidebar">
      <div class="sidebar-section">
        <span class="sidebar-label">DATOS DE UNIDAD</span>
        <div class="sidebar-field">
          <span class="field-label">Kilometraje</span>
          <span class="field-value">5,000 km</span>
        </div>
        <div class="sidebar-field">
          <span class="field-label">Placas</span>
          <span class="field-value">CJL-3HJ-9</span>
        </div>
        <div class="sidebar-field">
          <span class="field-label">Tipo</span>
          <span class="field-value">Rápida</span>
        </div>
      </div>

      <div class="sidebar-section">
        <span class="sidebar-label">GUARDIA</span>
        <select class="styled-select" v-model="guardia">
          <option value="" disabled>Seleccionar guardia</option>
          <option value="A">Guardia A</option>
          <option value="B">Guardia B</option>
          <option value="C">Guardia C</option>
          <option value="D">Guardia D</option>
        </select>
      </div>

      <div class="sidebar-section">
        <span class="sidebar-label">RESUMEN</span>
        <div class="summary-row">
          <span class="sum-dot good"></span>
          <span class="sum-label">Buenos</span>
          <span class="sum-count">{{ countStatus('Bueno') }}</span>
        </div>
        <div class="summary-row">
          <span class="sum-dot bad"></span>
          <span class="sum-label">Malos</span>
          <span class="sum-count">{{ countStatus('Malo') }}</span>
        </div>
        <div class="summary-row">
          <span class="sum-dot na"></span>
          <span class="sum-label">N/A</span>
          <span class="sum-count">{{ countStatus('N/A') }}</span>
        </div>
      </div>

      <div class="sidebar-actions">
        <button class="btn btn--orange">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar Avería
        </button>
        <button class="btn btn--primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Guardar Bitácora
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'receptionLogsVehicle',
  data() {
    return {
      guardia: '',
      checkState: {},
      sections: [
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='3'/><path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'/></svg>`, title: 'Sistema de Luces', open: true, items: ['Luz delantera alta', 'Luz delantera baja', 'Luces de emergencia', 'Luces neblineros', 'Luz direccional', 'Luz de freno', 'Luz de reversa', 'Luces interior cabina'] },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='1' y='3' width='15' height='13'/><polygon points='16 8 20 8 23 11 23 16 16 16 16 8'/><circle cx='5.5' cy='18.5' r='2.5'/><circle cx='18.5' cy='18.5' r='2.5'/></svg>`, title: 'Carrocería', open: false, items: ['Motor adicional', 'Estado de Tablero/Indicadores', 'Elevadores de cristales', 'Espejo lateral derecho', 'Espejo lateral izquierdo', 'Espejo retrovisor', 'Cristal parabrisas', 'Cristal medallón', 'Cristal de puertas'] },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'/></svg>`, title: 'Herramientas y Equipo', open: false, items: ['Gato hidráulico', 'Herramientas cambio de ruedas', 'Bocina de sonoros', 'Módulo luminosos y sonoros', 'Torreta', 'Cinturones de seguridad', 'Limpiaparabrisas', 'Póliza de seguro', 'Tarjeta de circulación'] },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 22V12'/><path d='M5 12H2a10 10 0 0 0 20 0h-3'/><path d='M8 12V6l4-4 4 4v6'/></svg>`, title: 'Tapones y Sellos', open: false, items: ['Tapón de tanque de combustible', 'Tapón de aceite', 'Tapón de agua', 'Nivel de aceite motor', 'Nivel de aceite transmisión', 'Nivel de agua radiador', 'Nivel líquido de frenos'] },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/><circle cx='12' cy='12' r='3'/></svg>`, title: 'Estado de Llantas', open: false, items: ['Llanta delantera derecha', 'Llanta delantera izquierda', 'Llanta trasera derecha', 'Llanta trasera izquierda', 'Llanta de repuesto'] },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='7.5' cy='15.5' r='5.5'/><path d='M21 2l-9.6 9.6'/><path d='M15.5 7.5l3 3L22 7l-3-3'/></svg>`, title: 'Arranque de Motor', open: false, items: ['Llaves de encendido', 'Switch de encendido', 'Batería', 'Postes y terminales batería'] },
      ]
    }
  },
  methods: {
    countStatus(status) {
      return Object.values(this.checkState).filter(v => v === status).length;
    }
  }
}
</script>

<style scoped>
.reception-logs {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.checklist-area {
  flex: 1;
  overflow: hidden;
  border-right: 1px solid var(--border-subtle);
}

.checklist-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checklist-section {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}

.section-header:hover { background: var(--bg-card-hover); }

.section-icon { font-size: 0.9rem; }

.section-title {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.06em;
  flex: 1;
}

.badge-count {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.section-chevron {
  font-size: 1.1rem;
  color: var(--text-muted);
  transition: transform 0.2s;
  line-height: 1;
}

.section-chevron.open { transform: rotate(90deg); color: var(--accent-primary); }

.section-items {
  background: var(--bg-card);
  border-top: 1px solid var(--border-subtle);
}

.check-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid var(--border-subtle);
  gap: 12px;
}

.check-row:last-child { border-bottom: none; }

.check-name {
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: var(--text-secondary);
  flex: 1;
}

.check-options {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.check-opt {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  padding: 3px 10px;
  border-radius: 2px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.05em;
}

.check-opt:hover { color: var(--text-primary); border-color: var(--text-muted); }
.check-opt--active-good { background: rgba(46,196,182,0.15) !important; color: var(--accent-green) !important; border-color: rgba(46,196,182,0.4) !important; }
.check-opt--active-bad { background: rgba(230,57,70,0.15) !important; color: var(--accent-red) !important; border-color: rgba(230,57,70,0.4) !important; }
.check-opt--active-na { background: rgba(139,146,165,0.15) !important; color: var(--text-secondary) !important; border-color: rgba(139,146,165,0.4) !important; }

/* Sidebar */
.reception-sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.sidebar-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 8px;
}

.sidebar-section {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-subtle);
}

.sidebar-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.field-label {
  font-family: var(--font-body);
  font-size: 0.73rem;
  color: var(--text-muted);
}

.field-value {
  font-family: var(--font-mono);
  font-size: 0.73rem;
  color: var(--text-primary);
  font-weight: 600;
}

.styled-select {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.78rem;
  padding: 7px 10px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.styled-select:focus { outline: none; border-color: var(--border-accent); }

.summary-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.sum-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.sum-dot.good { background: var(--accent-green); }
.sum-dot.bad { background: var(--accent-red); }
.sum-dot.na { background: var(--text-muted); }

.sum-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
  flex: 1;
}

.sum-count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-primary);
  font-weight: 700;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.btn {
  width: 100%;
  padding: 10px 0;
  border-radius: var(--radius);
  border: 1px solid transparent;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s;
}

.btn--orange { background: rgba(255,140,0,0.15); color: var(--accent-primary); border-color: rgba(255,140,0,0.3); }
.btn--orange:hover { background: rgba(255,140,0,0.28); }
.btn--primary { background: rgba(46,127,255,0.15); color: var(--accent-blue); border-color: rgba(46,127,255,0.3); }
.btn--primary:hover { background: rgba(46,127,255,0.28); }
</style>
