<template>
  <div class="general-info">
    <!-- Vehicle images -->
    <div class="views-panel">
      <div class="view-main">
        <img :src="getVehicleViewImage('reaction', vehicleNumber, selectedView)" :alt="viewLabels[selectedView]" class="view-img">
        <span class="view-label">{{ viewLabels[selectedView] }}</span>
        <button class="edit-image-btn" @click="showImageUpload = true" title="Cambiar imagen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
      <div class="views-secondary">
        <div 
          v-for="view in views" 
          :key="view.id"
          class="view-sm"
          :class="{ 'view-sm--active': selectedView === view.id }"
          @click="selectedView = view.id"
        >
          <img :src="getVehicleViewImage('reaction', vehicleNumber, view.id)" :alt="view.label" class="view-img-sm">
          <span class="view-label-sm">{{ view.label }}</span>
        </div>
      </div>
    </div>

    <!-- Image Upload Modal -->
    <div v-if="showImageUpload" class="modal-overlay" @click.self="showImageUpload = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Cambiar Imagen - {{ viewLabels[selectedView] }}</h3>
          <button class="modal-close" @click="showImageUpload = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="upload-zone" @dragover.prevent @drop.prevent="handleDrop">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          <p>Arrastra una imagen aqui o</p>
          <label class="upload-btn">
            <input type="file" accept="image/*" @change="handleFileSelect" hidden>
            Seleccionar archivo
          </label>
          <span class="upload-hint">PNG, JPG hasta 5MB</span>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showImageUpload = false">Cancelar</button>
          <button class="btn-save" :disabled="!pendingImage" @click="saveImage">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Info panel -->
    <div class="info-panel">
      <div class="info-date">
        <span class="info-label">FECHA DE CONSULTA</span>
        <span class="info-value-sm">{{ new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
      </div>

      <div class="info-row" v-if="vehicleData">
        <div class="info-field">
          <span class="info-label">PLACAS</span>
          <span class="info-value">{{ vehicleData.placas }}</span>
        </div>
        <div class="info-field">
          <span class="info-label">KILOMETRAJE</span>
          <span class="info-value">{{ vehicleData.kilometraje?.toLocaleString() }} km</span>
        </div>
      </div>

      <div class="checks-list">
        <span class="checks-title">INSPECCION DE UNIDAD</span>
        <button
          v-for="check in checks"
          :key="check.label"
          class="check-btn"
          @click="check.expanded = !check.expanded"
        >
          <span class="check-icon" v-html="check.icon"></span>
          <span class="check-label">{{ check.label }}</span>
          <span class="check-arrow" :class="{ 'rotated': check.expanded }">></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getTypeVehicle } from '@/components/scripts/getVehicles';
import { getVehicleViewImage } from '@/utils/imageLoader';
export default {
  name: 'generalInfoVehicle',
  data() {
    return {
      vehicleNumber: 0,
      vehicleData: null,
      selectedView: 'right',
      showImageUpload: false,
      pendingImage: null,
      views: [
        { id: 'front', label: 'FRENTE' },
        { id: 'back', label: 'TRASERA' },
        { id: 'left', label: 'LATERAL IZQ.' },
        { id: 'right', label: 'LATERAL DER.' },
        { id: 'up', label: 'SUPERIOR' }
      ],
      viewLabels: {
        front: 'FRENTE',
        back: 'TRASERA',
        left: 'LATERAL IZQUIERDA',
        right: 'LATERAL DERECHA',
        up: 'SUPERIOR'
      },
      checks: [
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='3'/><path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'/></svg>`, label: 'Sistema de Luces', expanded: false },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5'/><path d='M19.07 4.93a10 10 0 0 1 0 14.14'/><path d='M15.54 8.46a5 5 0 0 1 0 7.07'/></svg>`, label: 'Sistema de Sonoros', expanded: false },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='7.5' cy='15.5' r='5.5'/><path d='M21 2l-9.6 9.6'/><path d='M15.5 7.5l3 3L22 7l-3-3'/></svg>`, label: 'Arranque de Motor', expanded: false },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/><circle cx='12' cy='12' r='3'/></svg>`, label: 'Estado de Llantas', expanded: false },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 22V12'/><path d='M5 12H2a10 10 0 0 0 20 0h-3'/><path d='M8 12V6l4-4 4 4v6'/></svg>`, label: 'Tapones y Sellos', expanded: false },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z'/></svg>`, label: 'Niveles del Sistema', expanded: false },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='1' y='3' width='15' height='13'/><polygon points='16 8 20 8 23 11 23 16 16 16 16 8'/><circle cx='5.5' cy='18.5' r='2.5'/><circle cx='18.5' cy='18.5' r='2.5'/></svg>`, label: 'Carroceria', expanded: false },
        { icon: `<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'/></svg>`, label: 'Herramienta y Equipo', expanded: false },
      ]
    }
  },
  methods: {
    getVehicleViewImage,
    handleFileSelect(e) {
      const file = e.target.files[0];
      if (file) this.pendingImage = file;
    },
    handleDrop(e) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) this.pendingImage = file;
    },
    saveImage() {
      // TODO: Upload image to server
      console.log('[ITSIO] Saving image for view:', this.selectedView, this.pendingImage);
      this.showImageUpload = false;
      this.pendingImage = null;
    }
  },
  async created() {
    this.vehicleNumber = this.$route.params.numberVehicle;
    this.vehicleData = await getTypeVehicle(this.vehicleNumber);
  }
}
</script>

<style scoped>
.general-info {
  display: flex;
  height: 100%;
  overflow: hidden;
  gap: 0;
}

.views-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #1a1a1c;
  border-right: 1px solid var(--border-subtle);
  overflow: hidden;
}

.view-main {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #161618;
  overflow: hidden;
}

.view-img {
  max-width: 90%;
  max-height: 100%;
  object-fit: contain;
}

.view-label {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-muted);
  letter-spacing: 0.2em;
  background: rgba(0,0,0,0.6);
  padding: 2px 8px;
  border-radius: 2px;
  white-space: nowrap;
}

.views-secondary {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-top: 1px solid var(--border-subtle);
  height: 90px;
  flex-shrink: 0;
}

.view-sm {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1c;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  border-right: 1px solid var(--border-subtle);
}

.view-sm:last-child { border-right: none; }
.view-sm:hover { background: #242426; }
.view-sm--active { 
  background: #242426; 
  border-bottom: 2px solid var(--accent-secondary);
}

.view-img-sm {
  max-width: 85%;
  max-height: 70px;
  object-fit: contain;
}

.view-label-sm {
  position: absolute;
  bottom: 3px;
  font-family: var(--font-mono);
  font-size: 0.45rem;
  color: var(--text-muted);
  letter-spacing: 0.15em;
}

/* Info panel */
.info-panel {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  padding: 16px;
}

.info-date {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 14px;
}

.info-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 3px;
}

.info-value {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}

.info-value-sm {
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: var(--text-secondary);
  text-transform: capitalize;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 14px;
}

.info-field { display: flex; flex-direction: column; gap: 2px; }

.checks-title {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 8px;
}

.checks-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.check-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.check-btn:hover { background: var(--bg-card-hover); color: var(--text-primary); border-color: var(--border-accent); }

.check-icon { font-size: 0.9rem; flex-shrink: 0; }
.check-label { flex: 1; }

.check-arrow {
  font-size: 1rem;
  color: var(--text-muted);
  transition: transform 0.2s;
  line-height: 1;
}

.check-arrow.rotated { transform: rotate(90deg); color: var(--accent-primary); }

/* Edit image button */
.edit-image-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  background: rgba(0,0,0,0.7);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.edit-image-btn:hover {
  background: rgba(220,38,38,0.2);
  border-color: var(--accent-secondary);
  color: var(--accent-secondary);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  width: 400px;
  max-width: 90vw;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-header h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  transition: color 0.2s;
}
.modal-close:hover { color: var(--text-primary); }

.upload-zone {
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 2px dashed var(--border-subtle);
  border-radius: var(--radius);
  margin: 20px;
  color: var(--text-muted);
  transition: all 0.2s;
}
.upload-zone:hover {
  border-color: var(--accent-secondary);
  background: rgba(220,38,38,0.05);
}

.upload-zone p {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.85rem;
}

.upload-btn {
  padding: 8px 16px;
  background: rgba(220,38,38,0.1);
  border: 1px solid rgba(220,38,38,0.3);
  border-radius: var(--radius);
  color: var(--accent-secondary);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.upload-btn:hover {
  background: rgba(220,38,38,0.2);
}

.upload-hint {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-subtle);
}

.btn-cancel, .btn-save {
  padding: 8px 16px;
  border-radius: var(--radius);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}
.btn-cancel:hover {
  border-color: var(--border-accent);
  color: var(--text-primary);
}

.btn-save {
  background: var(--accent-secondary);
  border: 1px solid var(--accent-secondary);
  color: white;
}
.btn-save:hover {
  background: #b91c1c;
}
.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
