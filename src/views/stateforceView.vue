<template>
  <div class="stateforce-view">
    <div class="view-header">
      <div>
        <span class="section-tag">// PERSONAL OPERATIVO</span>
        <h2 class="view-title">Estado de Fuerza</h2>
      </div>
      <div class="header-actions">
        <button class="hdr-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Buscar personal
        </button>
        <button class="hdr-btn hdr-btn--primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar Bombero
        </button>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="force-summary">
      <div class="fs-card fs-card--green">
        <div class="fs-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="fs-data">
          <span class="fs-val">18</span>
          <span class="fs-label">Activos</span>
        </div>
      </div>
      <div class="fs-card fs-card--orange">
        <div class="fs-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="fs-data">
          <span class="fs-val">6</span>
          <span class="fs-label">En Guardia</span>
        </div>
      </div>
      <div class="fs-card fs-card--blue">
        <div class="fs-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="fs-data">
          <span class="fs-val">24</span>
          <span class="fs-label">Total Fuerza</span>
        </div>
      </div>
      <div class="fs-card fs-card--red">
        <div class="fs-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
        <div class="fs-data">
          <span class="fs-val">2</span>
          <span class="fs-label">Vacaciones</span>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="force-content">
      <!-- Guard assignment panel -->
      <div class="guard-panel">
        <div class="panel-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>ASIGNACIÓN DE GUARDIAS</span>
        </div>
        <div class="guard-list">
          <div v-for="g in guards" :key="g.id" class="guard-row">
            <div :class="['guard-badge', `guard-badge--${g.active ? 'active' : 'off'}`]">{{ g.name }}</div>
            <div class="guard-members">
              <div v-for="m in g.members" :key="m" class="member-chip">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                {{ m }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Personnel list -->
      <div class="personnel-list">
        <div class="panel-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <span>DIRECTORIO DE PERSONAL</span>
        </div>
        <div class="personnel-table">
          <div class="pt-head">
            <span>NOMBRE</span><span>RANGO</span><span>GUARDIA</span><span>ESTADO</span>
          </div>
          <div v-for="p in personnel" :key="p.id" class="pt-row">
            <div class="pt-name">
              <div class="pt-avatar">{{ p.name[0] }}</div>
              {{ p.name }}
            </div>
            <span class="pt-rank">{{ p.rank }}</span>
            <div :class="['guard-chip', `guard-chip--${p.guard.toLowerCase()}`]">{{ p.guard }}</div>
            <span :class="['status-badge', `status-${p.status === 'Activo' ? 'operativa' : p.status === 'Guardia' ? 'taller' : 'in-operativa'}`]">{{ p.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'stateforceView',
  data() {
    return {
      guards: [
        { id: 'A', name: 'Guardia A', active: true, members: ['S. Molina', 'J. García', 'R. López', 'P. Ramírez'] },
        { id: 'B', name: 'Guardia B', active: false, members: ['M. Torres', 'A. Hernández', 'F. Cruz', 'L. Martínez'] },
        { id: 'C', name: 'Guardia C', active: false, members: ['E. Díaz', 'C. Vega', 'O. Ruiz'] },
        { id: 'D', name: 'Guardia D', active: false, members: ['I. Flores', 'N. Morales', 'D. Jiménez'] },
      ],
      personnel: [
        { id: 1, name: 'Salomon Molina', rank: 'Oficial', guard: 'A', status: 'Activo' },
        { id: 2, name: 'Juan García',    rank: 'Bombero', guard: 'A', status: 'Guardia' },
        { id: 3, name: 'Rosa López',     rank: 'Bombero', guard: 'A', status: 'Activo' },
        { id: 4, name: 'Marco Torres',   rank: 'Suboficial', guard: 'B', status: 'Activo' },
        { id: 5, name: 'Ana Hernández',  rank: 'Bombero', guard: 'B', status: 'Vacaciones' },
        { id: 6, name: 'Elena Díaz',     rank: 'Oficial', guard: 'C', status: 'Activo' },
      ]
    }
  }
}
</script>

<style scoped>
.stateforce-view { padding-top: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }

.view-header { display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
.view-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--text-primary); letter-spacing: 0.06em; }

.header-actions { display: flex; gap: 8px; }
.hdr-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; font-family: var(--font-display); font-size: 0.78rem; font-weight: 600;
  letter-spacing: 0.06em; border-radius: var(--radius); border: 1px solid var(--border-subtle);
  background: var(--bg-card); color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
}
.hdr-btn:hover { border-color: var(--border-accent); color: var(--text-primary); }
.hdr-btn--primary { background: rgba(220,38,38,0.1); border-color: rgba(220,38,38,0.3); color: var(--accent-secondary); }

/* Summary */
.force-summary { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; flex-shrink: 0; }
.fs-card {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
  transition: border-color 0.2s;
}
.fs-card:hover { border-color: var(--border-accent); }
.fs-card--green { border-left: 3px solid var(--accent-green); }
.fs-card--orange { border-left: 3px solid var(--accent-orange); }
.fs-card--blue { border-left: 3px solid var(--accent-blue); }
.fs-card--red { border-left: 3px solid var(--accent-red); }
.fs-icon { color: var(--text-muted); }
.fs-card--green .fs-icon { color: var(--accent-green); }
.fs-card--orange .fs-icon { color: var(--accent-orange); }
.fs-card--blue .fs-icon { color: var(--accent-blue); }
.fs-card--red .fs-icon { color: var(--accent-red); }
.fs-data { display: flex; flex-direction: column; }
.fs-val { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; color: var(--text-primary); line-height: 1; }
.fs-label { font-family: var(--font-mono); font-size: 0.58rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 3px; }

/* Content */
.force-content { display: grid; grid-template-columns: 300px 1fr; gap: 12px; flex: 1; min-height: 0; overflow: hidden; }

.panel-header {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: 0.6rem;
  color: var(--accent-secondary); letter-spacing: 0.18em;
  padding: 12px 16px; border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.guard-panel {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden;
}
.guard-list { display: flex; flex-direction: column; gap: 0; overflow-y: auto; flex: 1; padding: 8px 0; }
.guard-row { padding: 10px 16px; border-bottom: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 8px; }
.guard-row:last-child { border-bottom: none; }

.guard-badge {
  display: inline-flex; align-items: center;
  font-family: var(--font-mono); font-size: 0.62rem;
  letter-spacing: 0.12em; padding: 3px 10px; border-radius: 2px;
  width: fit-content;
}
.guard-badge--active { background: rgba(220,38,38,0.1); color: var(--accent-secondary); border: 1px solid rgba(220,38,38,0.3); }
.guard-badge--off { background: var(--bg-secondary); color: var(--text-muted); border: 1px solid var(--border-subtle); }

.guard-members { display: flex; flex-wrap: wrap; gap: 4px; }
.member-chip {
  display: flex; align-items: center; gap: 4px;
  font-family: var(--font-body); font-size: 0.7rem;
  color: var(--text-secondary); background: var(--bg-secondary);
  border: 1px solid var(--border-subtle); border-radius: 3px;
  padding: 3px 8px; white-space: nowrap;
}

/* Personnel table */
.personnel-list {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden;
}
.personnel-table { flex: 1; overflow-y: auto; }
.pt-head {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 8px 16px; border-bottom: 1px solid var(--border-subtle);
  font-family: var(--font-mono); font-size: 0.58rem;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em;
  position: sticky; top: 0; background: var(--bg-card); z-index: 1;
}
.pt-row {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 10px 16px; border-bottom: 1px solid var(--border-subtle);
  align-items: center; transition: background 0.2s;
}
.pt-row:hover { background: var(--bg-card-hover); }
.pt-name { display: flex; align-items: center; gap: 9px; font-family: var(--font-body); font-size: 0.85rem; color: var(--text-primary); }
.pt-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.25);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 0.75rem; font-weight: 700;
  color: var(--accent-secondary); flex-shrink: 0;
}
.pt-rank { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary); letter-spacing: 0.05em; }
.guard-chip { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em; padding: 2px 8px; border-radius: 2px; width: fit-content; }
.guard-chip--a { background: rgba(220,38,38,0.1); color: var(--accent-secondary); border: 1px solid rgba(220,38,38,0.2); }
.guard-chip--b { background: rgba(59,130,246,0.1); color: var(--accent-blue); border: 1px solid rgba(59,130,246,0.2); }
.guard-chip--c { background: rgba(34,197,94,0.08); color: var(--accent-green); border: 1px solid rgba(34,197,94,0.2); }
.guard-chip--d { background: rgba(245,158,11,0.1); color: var(--accent-amber); border: 1px solid rgba(245,158,11,0.2); }
</style>
