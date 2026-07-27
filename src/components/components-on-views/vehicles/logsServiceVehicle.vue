<template>
  <div class="logs-service">
    <!-- Column 1: Apertura -->
    <div class="service-col">
      <div class="col-header">
        <span class="col-tag">FASE 1</span>
        <h4 class="col-title">Apertura de Incidente</h4>
      </div>
      <div class="col-body">
        <div class="form-field">
          <label class="form-label">No. Consecutivo</label>
          <input type="text" class="form-input form-input--readonly" value="4567654" readonly>
        </div>
        <div class="form-field">
          <label class="form-label">Kilometraje</label>
          <input type="text" class="form-input" placeholder="20004">
        </div>
        <div class="form-field">
          <label class="form-label">Conductor</label>
          <input type="text" class="form-input" placeholder="Nombre del conductor">
        </div>
        <div class="form-field">
          <label class="form-label">Apoyo 1</label>
          <input type="text" class="form-input" placeholder="Nombre">
        </div>
        <div class="form-field">
          <label class="form-label">Apoyo 2</label>
          <input type="text" class="form-input" placeholder="Nombre">
        </div>
        <div class="form-field">
          <label class="form-label">Apoyo 3</label>
          <input type="text" class="form-input" placeholder="Nombre">
        </div>
      </div>
      <button class="action-btn action-btn--red">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      Abrir Nuevo Incidente
    </button>
    </div>

    <!-- Column 2: Despacho -->
    <div class="service-col">
      <div class="col-header">
        <span class="col-tag">FASE 2</span>
        <h4 class="col-title">Despacho al Servicio</h4>
      </div>
      <div class="col-body">
        <div class="form-field">
          <label class="form-label">Tipo de Servicio</label>
          <input type="text" class="form-input" placeholder="Ej. Rescate, Incendio...">
        </div>
        <div class="form-field">
          <label class="form-label">Folio</label>
          <input type="text" class="form-input" placeholder="Folio de despacho">
        </div>
        <div class="form-field">
          <label class="form-label">Colonia</label>
          <input type="text" class="form-input" placeholder="Colonia">
        </div>
        <div class="form-field">
          <label class="form-label">Calle</label>
          <input type="text" class="form-input" placeholder="Calle">
        </div>
        <div class="form-field">
          <label class="form-label">Cruce</label>
          <input type="text" class="form-input" placeholder="Cruce / entre calles">
        </div>
        <div class="form-field">
          <label class="form-label">Reportante</label>
          <input type="text" class="form-input" placeholder="Nombre del reportante">
        </div>
        <div class="form-field">
          <label class="form-label">Teléfono</label>
          <input type="text" class="form-input" placeholder="Teléfono de contacto">
        </div>
      </div>
      <button class="action-btn action-btn--blue">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      Dirigirse al Servicio
    </button>
    </div>

    <!-- Column 3: Cierre -->
    <div class="service-col">
      <div class="col-header">
        <span class="col-tag">FASE 3</span>
        <h4 class="col-title">Cierre del Incidente</h4>
      </div>
      <div class="col-body">
        <div class="form-field">
          <label class="form-label">Tipo de Cierre</label>
          <input type="text" class="form-input" placeholder="Ej. Controlado, Cancelado...">
        </div>
        <div class="form-field form-field--grow">
          <label class="form-label">Generales y Conclusiones</label>
          <textarea class="form-textarea" placeholder="Descripción detallada del servicio, acciones realizadas, observaciones finales..."></textarea>
        </div>
      </div>
      <div class="action-group">
        <button class="action-btn action-btn--gray">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      Agregar Percance / Avería
    </button>
        <button class="action-btn action-btn--gray">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Modificar Datos
    </button>
        <button class="action-btn action-btn--green">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      Cerrar Atención del Incidente
    </button>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'logsServiceVehicle' }
</script>

<style scoped>
.logs-service {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  overflow: hidden;
  gap: 0;
}

.service-col {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-subtle);
  overflow: hidden;
}

.service-col:last-child { border-right: none; }

.col-header {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.col-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--accent-primary);
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 3px;
}

.col-title {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 0.06em;
}

.col-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-field--grow {
  flex: 1;
}

.form-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.form-input {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.82rem;
  padding: 7px 10px;
  transition: border-color 0.2s;
  outline: none;
}

.form-input:focus { border-color: var(--border-accent); }
.form-input::placeholder { color: var(--text-muted); }

.form-input--readonly {
  color: var(--accent-primary);
  font-family: var(--font-mono);
  background: rgba(255,140,0,0.05);
  cursor: not-allowed;
}

.form-textarea {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.82rem;
  padding: 10px;
  resize: none;
  flex: 1;
  min-height: 100px;
  outline: none;
  transition: border-color 0.2s;
}

.form-textarea:focus { border-color: var(--border-accent); }
.form-textarea::placeholder { color: var(--text-muted); }

.action-btn {
  flex-shrink: 0;
  margin: 0 16px 12px;
  padding: 10px 0;
  border-radius: var(--radius);
  border: 1px solid transparent;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s;
  width: calc(100% - 32px);
}

.action-btn--orange { background: rgba(255,140,0,0.15); color: var(--accent-primary); border-color: rgba(255,140,0,0.3); }
.action-btn--orange:hover { background: rgba(255,140,0,0.28); }
.action-btn--blue { background: rgba(46,127,255,0.15); color: var(--accent-blue); border-color: rgba(46,127,255,0.3); }
.action-btn--blue:hover { background: rgba(46,127,255,0.28); }
.action-btn--green { background: rgba(46,196,182,0.15); color: var(--accent-green); border-color: rgba(46,196,182,0.3); }
.action-btn--green:hover { background: rgba(46,196,182,0.28); }
.action-btn--gray { background: rgba(139,146,165,0.1); color: var(--text-secondary); border-color: var(--border-subtle); }
.action-btn--gray:hover { background: rgba(139,146,165,0.2); color: var(--text-primary); }

.action-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 16px 12px;
  flex-shrink: 0;
}

.action-group .action-btn {
  margin: 0;
  width: 100%;
}
</style>
