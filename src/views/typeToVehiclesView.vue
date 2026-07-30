<template>
  <div class="type-vehicles-view">
    <div class="view-header">
      <div>
        <span class="section-tag">// FLOTA VEHICULAR</span>
        <h2 class="view-title">Tipos de Unidades</h2>
      </div>
      <div class="header-actions">
        <div class="meta-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <span>{{ stockVehicle.length }} tipos de unidades</span>
        </div>
        <button class="add-vehicle-btn" @click="showAddModal = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar Unidad
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Cargando flota...</span>
    </div>

    <div class="type-grid" v-else>
      <router-link
        v-for="(value, index) in stockVehicle"
        :key="index"
        class="type-card"
        :to="`/type-vehicle/${value.type}`"
      >
        <div class="card-image-wrap">
          <img :src="getVehicleTypeImage(value.img)" :alt="value.type" class="card-image">
          <div class="card-overlay"></div>
          <div class="card-type-badge">{{ value.type }}</div>
        </div>
        <div class="card-content">
          <div class="card-stats">
            <div class="stat-pill stat-pill--green">
              <span class="stat-dot"></span>
              <span>{{ value.operativeVehicles }} operativas</span>
            </div>
            <div class="stat-pill stat-pill--orange">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <span>{{ value.VehiclesWorkshop }} en taller</span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-total">
              <span class="total-label">Total en flota</span>
              <span class="total-val">{{ value.operativeVehicles + value.VehiclesWorkshop }}</span>
            </div>
            <div class="card-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Add Vehicle Modal -->
    <transition name="modal">
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Agregar Nueva Unidad</h3>
            <button class="modal-close" @click="showAddModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Numero de Unidad</label>
              <input type="text" v-model="newVehicle.numberUnit" placeholder="Ej: 99">
            </div>
            <div class="form-group">
              <label>Tipo de Unidad</label>
              <select v-model="newVehicle.type">
                <option value="">Seleccionar tipo</option>
                <option value="Motobomba">Motobomba</option>
                <option value="Escala">Escala</option>
                <option value="Rapida">Rapida</option>
                <option value="Sedan">Sedan</option>
                <option value="Pipa-Motobomba">Pipa-Motobomba</option>
              </select>
            </div>
            <div class="form-group">
              <label>Marca</label>
              <input type="text" v-model="newVehicle.carBrand" placeholder="Ej: Ford, Chevrolet">
            </div>
            <div class="form-group">
              <label>Modelo / Ano</label>
              <input type="text" v-model="newVehicle.model" placeholder="Ej: 2024">
            </div>
            <div class="form-group">
              <label>Placas</label>
              <input type="text" v-model="newVehicle.placas" placeholder="Ej: ABC-123-X">
            </div>
            <div class="form-group">
              <label>Kilometraje</label>
              <input type="number" v-model="newVehicle.kilometraje" placeholder="0">
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select v-model="newVehicle.status">
                <option value="operativa">Operativa</option>
                <option value="taller">En Taller</option>
                <option value="in-operativa">Inoperativa</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ubicacion Actual</label>
              <input type="text" v-model="newVehicle.location" placeholder="Ej: Estacion Central">
            </div>
          </div>

          <div class="modal-actions">
            <button class="cancel-btn" @click="showAddModal = false">Cancelar</button>
            <button class="confirm-btn" @click="addVehicle" :disabled="!canAddVehicle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Agregar Unidad
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getAllTypeToVehicles } from '@/components/scripts/getVehicles';
import { getVehicleTypeImage } from '@/utils/imageLoader';
export default {
  name: 'typeToVehiclesView',
  data() { 
    return { 
      stockVehicle: [], 
      loading: true,
      showAddModal: false,
      newVehicle: {
        numberUnit: '',
        type: '',
        carBrand: '',
        model: '',
        placas: '',
        kilometraje: 0,
        status: 'operativa',
        location: 'Estacion Central'
      }
    } 
  },
  computed: {
    canAddVehicle() {
      return this.newVehicle.numberUnit && this.newVehicle.type && this.newVehicle.carBrand
    }
  },
  methods: {
    getVehicleTypeImage,
    addVehicle() {
      if (!this.canAddVehicle) return
      
      // Find the type category and increment counts
      const typeIndex = this.stockVehicle.findIndex(v => v.type === this.newVehicle.type)
      if (typeIndex !== -1) {
        if (this.newVehicle.status === 'operativa') {
          this.stockVehicle[typeIndex].operativeVehicles++
        } else {
          this.stockVehicle[typeIndex].VehiclesWorkshop++
        }
      }
      
      // Reset form and close modal
      this.newVehicle = {
        numberUnit: '',
        type: '',
        carBrand: '',
        model: '',
        placas: '',
        kilometraje: 0,
        status: 'operativa',
        location: 'Estacion Central'
      }
      this.showAddModal = false
      
      alert('Unidad agregada exitosamente')
    }
  },
  async mounted() {
    this.stockVehicle = await getAllTypeToVehicles();
    this.loading = false;
  }
}
</script>

<style scoped>
.type-vehicles-view { padding-top: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }

.view-header { display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
.view-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--text-primary); letter-spacing: 0.06em; }

.header-meta { display: flex; gap: 8px; }
.meta-pill {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 0.62rem;
  color: var(--text-muted); letter-spacing: 0.1em;
  padding: 5px 12px; border-radius: 3px;
  background: var(--bg-card); border: 1px solid var(--border-subtle);
}

.loading-state {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.1em;
}
.loading-spinner {
  width: 24px; height: 24px; border-radius: 50%;
  border: 2px solid var(--border-subtle); border-top-color: var(--accent-secondary);
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.type-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; overflow-y: auto; flex: 1; }

.type-card {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); text-decoration: none; overflow: hidden;
  display: flex; flex-direction: column; transition: all 0.25s ease;
  position: relative; max-height: 300px;
}
.type-card:hover { border-color: var(--border-accent); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.4), var(--shadow-glow); }

.card-image-wrap { position: relative; height: 150px; background: #18181a; overflow: hidden; }
.card-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; opacity: 0.8; }
.type-card:hover .card-image { transform: scale(1.05); opacity: 1; }
.card-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 70%; background: linear-gradient(to top, var(--bg-card), transparent); }

.card-type-badge {
  position: absolute; bottom: 10px; left: 14px;
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  color: var(--text-primary); letter-spacing: 0.08em; text-transform: uppercase;
}

.card-content { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }
.card-stats { display: flex; gap: 6px; flex-wrap: wrap; }

.stat-pill {
  display: flex; align-items: center; gap: 5px;
  font-family: var(--font-mono); font-size: 0.62rem;
  padding: 3px 8px; border-radius: 2px; letter-spacing: 0.05em;
}
.stat-pill--green { background: var(--accent-green-glow); color: var(--accent-green); border: 1px solid rgba(34,197,94,0.25); }
.stat-pill--orange { background: var(--accent-orange-glow); color: var(--accent-orange); border: 1px solid rgba(249,115,22,0.25); }

.stat-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

.card-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 8px; }
.card-total { display: flex; flex-direction: column; }
.total-label { font-family: var(--font-mono); font-size: 0.56rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; }
.total-val { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; color: var(--accent-secondary); }

.card-arrow {
  color: var(--text-muted); opacity: 0;
  transition: all 0.2s; transform: translateX(-4px);
}
.type-card:hover .card-arrow { opacity: 1; transform: translateX(0); color: var(--accent-secondary); }

/* Header Actions */
.header-actions { display: flex; align-items: center; gap: 12px; }

.add-vehicle-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  background: var(--accent-secondary);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
}
.add-vehicle-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}
.modal-close:hover { color: var(--text-primary); }

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.85rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent-secondary);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-subtle);
}

.cancel-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.cancel-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.confirm-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--accent-secondary);
  border: none;
  border-radius: var(--radius);
  color: white;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.confirm-btn:hover:not(:disabled) { background: #b91c1c; }
.confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Modal Transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
