<template>
  <div class="tools-view">
    <div class="view-header">
      <div>
        <span class="section-tag">// SISTEMA · UTILIDADES</span>
        <h2 class="view-title">Herramientas</h2>
      </div>
    </div>

    <div class="tools-grid">
      <!-- Reports section -->
      <div class="tool-section">
        <div class="ts-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          REPORTES
        </div>
        <div class="tool-cards">
          <div v-for="r in reports" :key="r.id" class="tool-card">
            <div :class="['tool-icon', `tool-icon--${r.color}`]" v-html="r.icon"></div>
            <div class="tool-info">
              <span class="tool-name">{{ r.name }}</span>
              <span class="tool-desc">{{ r.desc }}</span>
            </div>
            <button class="tool-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar
            </button>
          </div>
        </div>
      </div>

      <!-- System info section -->
      <div class="tool-section">
        <div class="ts-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          ESTADO DEL SISTEMA
        </div>
        <div class="sys-stats">
          <div v-for="s in sysStats" :key="s.id" class="sys-stat">
            <span class="sys-label">{{ s.label }}</span>
            <div class="sys-bar-wrap">
              <div class="sys-bar"><div :class="['sys-fill', `sys-fill--${s.color}`]" :style="{width: s.val+'%'}"></div></div>
              <span :class="['sys-val', `sys-val--${s.color}`]">{{ s.val }}%</span>
            </div>
          </div>
        </div>
        <div class="sys-info-rows">
          <div v-for="i in sysInfo" :key="i.label" class="sys-info-row">
            <span class="si-label">{{ i.label }}</span>
            <span :class="['si-value', i.highlight ? 'si-value--accent' : '']">{{ i.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'toolsView',
  data() {
    return {
      reports: [
        {
          id: 1, name: 'Reporte de Flota', color: 'red',
          desc: 'Estado actual de todas las unidades vehiculares',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
        },
        {
          id: 2, name: 'Bitácoras de Servicio', color: 'amber',
          desc: 'Historial de incidentes y servicios prestados',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
        },
        {
          id: 3, name: 'Estado de Fuerza', color: 'blue',
          desc: 'Reporte de personal activo y guardias',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`
        },
        {
          id: 4, name: 'Mantenimientos', color: 'green',
          desc: 'Historial de taller y próximos servicios',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`
        },
      ],
      sysStats: [
        { id: 1, label: 'Disponibilidad de Flota', val: 73, color: 'green' },
        { id: 2, label: 'Ocupación de Personal', val: 75, color: 'blue' },
        { id: 3, label: 'Unidades en Servicio', val: 17, color: 'orange' },
      ],
      sysInfo: [
        { label: 'Versión del Sistema', value: 'ITSIO v2.0.0' },
        { label: 'Última Actualización', value: '22 May 2026', highlight: false },
        { label: 'Registros Totales', value: '1,248' },
        { label: 'Estado API', value: 'CONECTADO', highlight: true },
        { label: 'Base de Datos', value: 'ACTIVA', highlight: true },
      ]
    }
  }
}
</script>

<style scoped>
.tools-view { padding-top: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }
.view-header { display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
.view-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--text-primary); letter-spacing: 0.06em; }

.tools-grid { display: grid; grid-template-columns: 1fr 360px; gap: 16px; flex: 1; min-height: 0; overflow: hidden; }

.tool-section {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden;
}
.ts-header {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: 0.6rem;
  color: var(--accent-secondary); letter-spacing: 0.18em;
  padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); flex-shrink: 0;
}

.tool-cards { display: flex; flex-direction: column; gap: 0; overflow-y: auto; flex: 1; }
.tool-card {
  display: flex; align-items: center; gap: 14px;
  padding: 16px; border-bottom: 1px solid var(--border-subtle);
  transition: background 0.2s;
}
.tool-card:last-child { border-bottom: none; }
.tool-card:hover { background: var(--bg-card-hover); }

.tool-icon {
  width: 44px; height: 44px; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.tool-icon--red { background: rgba(220,38,38,0.1); color: var(--accent-secondary); border: 1px solid rgba(220,38,38,0.2); }
.tool-icon--amber { background: rgba(245,158,11,0.1); color: var(--accent-amber); border: 1px solid rgba(245,158,11,0.2); }
.tool-icon--blue { background: rgba(59,130,246,0.1); color: var(--accent-blue); border: 1px solid rgba(59,130,246,0.2); }
.tool-icon--green { background: var(--accent-green-glow); color: var(--accent-green); border: 1px solid rgba(34,197,94,0.2); }

.tool-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.tool-name { font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }
.tool-desc { font-family: var(--font-body); font-size: 0.75rem; color: var(--text-secondary); }

.tool-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: var(--radius);
  border: 1px solid var(--border-subtle); background: var(--bg-secondary);
  color: var(--text-secondary); font-family: var(--font-display); font-size: 0.75rem;
  font-weight: 600; letter-spacing: 0.06em; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.tool-btn:hover { border-color: var(--border-accent); color: var(--accent-secondary); }

/* Sys stats */
.sys-stats { padding: 16px; display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid var(--border-subtle); }
.sys-stat { display: flex; flex-direction: column; gap: 5px; }
.sys-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.sys-bar-wrap { display: flex; align-items: center; gap: 8px; }
.sys-bar { flex: 1; height: 6px; background: var(--bg-secondary); border-radius: 3px; overflow: hidden; }
.sys-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
.sys-fill--green { background: var(--accent-green); }
.sys-fill--blue { background: var(--accent-blue); }
.sys-fill--orange { background: var(--accent-orange); }
.sys-val { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.05em; width: 32px; text-align: right; }
.sys-val--green { color: var(--accent-green); }
.sys-val--blue { color: var(--accent-blue); }
.sys-val--orange { color: var(--accent-orange); }

.sys-info-rows { display: flex; flex-direction: column; gap: 0; overflow-y: auto; flex: 1; padding: 8px 0; }
.sys-info-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 16px; border-bottom: 1px solid var(--border-subtle); transition: background 0.2s;
}
.sys-info-row:last-child { border-bottom: none; }
.sys-info-row:hover { background: var(--bg-card-hover); }
.si-label { font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; }
.si-value { font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-secondary); letter-spacing: 0.05em; }
.si-value--accent { color: var(--accent-green); }
</style>
