<template>
  <div class="equipment-view">
    <div class="view-header">
      <div>
        <span class="section-tag">// INVENTARIO DE EQUIPO</span>
        <h2 class="view-title">Herramientas y Equipo</h2>
      </div>
      <div class="header-actions">
        <button class="hdr-btn" @click="showAddModal = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar Equipo
        </button>
      </div>
    </div>

    <!-- Equipment Categories -->
    <div class="categories-grid">
      <div 
        v-for="cat in categories" 
        :key="cat.id" 
        class="category-card"
        :class="{ 'category-card--active': selectedCategory === cat.id }"
        @click="selectedCategory = cat.id"
      >
        <div :class="['cat-icon', `cat-icon--${cat.color}`]" v-html="cat.icon"></div>
        <div class="cat-info">
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-count">{{ cat.count }} items</span>
        </div>
      </div>
    </div>

    <!-- Equipment List -->
    <div class="equipment-content">
      <div class="content-header">
        <span class="content-title">{{ currentCategory?.name || 'Todos' }}</span>
        <div class="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" v-model="searchQuery" placeholder="Buscar equipo...">
        </div>
      </div>

      <div class="equipment-grid">
        <div 
          v-for="item in filteredEquipment" 
          :key="item.id" 
          class="equipment-card"
          @click="selectEquipment(item)"
        >
          <div class="eq-image">
            <div class="eq-placeholder" v-html="item.icon"></div>
          </div>
          <div class="eq-info">
            <span class="eq-name">{{ item.name }}</span>
            <span class="eq-code">{{ item.code }}</span>
          </div>
          <div class="eq-meta">
            <span :class="['eq-status', `eq-status--${item.status}`]">
              {{ statusLabels[item.status] }}
            </span>
            <span class="eq-qty">Cant: {{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Equipment Detail Modal -->
    <div v-if="selectedEquipment" class="modal-overlay" @click.self="selectedEquipment = null">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>{{ selectedEquipment.name }}</h3>
          <button class="modal-close" @click="selectedEquipment = null">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-image">
              <div class="eq-placeholder-lg" v-html="selectedEquipment.icon"></div>
            </div>
            <div class="detail-info">
              <div class="detail-row">
                <span class="detail-label">CODIGO</span>
                <span class="detail-value">{{ selectedEquipment.code }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">CATEGORIA</span>
                <span class="detail-value">{{ getCategoryName(selectedEquipment.category) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ESTADO</span>
                <span :class="['detail-status', `detail-status--${selectedEquipment.status}`]">
                  {{ statusLabels[selectedEquipment.status] }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">CANTIDAD</span>
                <span class="detail-value">{{ selectedEquipment.quantity }} unidades</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">UBICACION</span>
                <span class="detail-value">{{ selectedEquipment.location }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ULTIMA REVISION</span>
                <span class="detail-value">{{ selectedEquipment.lastCheck }}</span>
              </div>
              <div class="detail-row" v-if="selectedEquipment.expiry">
                <span class="detail-label">VENCIMIENTO</span>
                <span class="detail-value detail-value--warn">{{ selectedEquipment.expiry }}</span>
              </div>
            </div>
          </div>
          <div class="detail-notes" v-if="selectedEquipment.notes">
            <span class="detail-label">NOTAS</span>
            <p>{{ selectedEquipment.notes }}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="openEditModal">Editar</button>
          <button class="btn-primary" @click="openUsageModal">Registrar Uso</button>
        </div>
      </div>
    </div>

    <!-- Add Equipment Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>Agregar Nuevo Equipo</h3>
          <button class="modal-close" @click="showAddModal = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Nombre del Equipo</label>
              <input type="text" v-model="newEquipment.name" placeholder="Ej: Casco Estructural">
            </div>
            <div class="form-group">
              <label>Codigo</label>
              <input type="text" v-model="newEquipment.code" placeholder="Ej: EPP-007">
            </div>
            <div class="form-group">
              <label>Categoria</label>
              <select v-model="newEquipment.category">
                <option value="epp">EPP</option>
                <option value="hydraulic">Hidraulico</option>
                <option value="hoses">Mangueras</option>
                <option value="medical">Medico</option>
                <option value="extinction">Extincion</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad</label>
              <input type="number" v-model="newEquipment.quantity" min="1">
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select v-model="newEquipment.status">
                <option value="operativo">Operativo</option>
                <option value="mantenimiento">En Mantenimiento</option>
                <option value="danado">Danado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ubicacion</label>
              <input type="text" v-model="newEquipment.location" placeholder="Ej: Almacen Principal">
            </div>
            <div class="form-group full-width">
              <label>Notas (opcional)</label>
              <textarea v-model="newEquipment.notes" placeholder="Observaciones adicionales..."></textarea>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showAddModal = false">Cancelar</button>
          <button class="btn-primary" @click="saveNewEquipment">Guardar Equipo</button>
        </div>
      </div>
    </div>

    <!-- Edit Equipment Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>Editar Equipo</h3>
          <button class="modal-close" @click="showEditModal = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Nombre del Equipo</label>
              <input type="text" v-model="editingEquipment.name">
            </div>
            <div class="form-group">
              <label>Codigo</label>
              <input type="text" v-model="editingEquipment.code" disabled>
            </div>
            <div class="form-group">
              <label>Categoria</label>
              <select v-model="editingEquipment.category">
                <option value="epp">EPP</option>
                <option value="hydraulic">Hidraulico</option>
                <option value="hoses">Mangueras</option>
                <option value="medical">Medico</option>
                <option value="extinction">Extincion</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad</label>
              <input type="number" v-model="editingEquipment.quantity" min="1">
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select v-model="editingEquipment.status">
                <option value="operativo">Operativo</option>
                <option value="mantenimiento">En Mantenimiento</option>
                <option value="danado">Danado</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ubicacion</label>
              <input type="text" v-model="editingEquipment.location">
            </div>
            <div class="form-group full-width">
              <label>Notas</label>
              <textarea v-model="editingEquipment.notes"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showEditModal = false">Cancelar</button>
          <button class="btn-primary" @click="saveEditedEquipment">Guardar Cambios</button>
        </div>
      </div>
    </div>

    <!-- Usage Modal -->
    <div v-if="showUsageModal" class="modal-overlay" @click.self="showUsageModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Registrar Uso</h3>
          <button class="modal-close" @click="showUsageModal = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Equipo</label>
              <input type="text" :value="usageEquipmentRef?.name" disabled>
            </div>
            <div class="form-group">
              <label>Cantidad a Usar</label>
              <input type="number" v-model="usageData.quantity" min="1" :max="usageEquipmentRef?.quantity">
            </div>
            <div class="form-group">
              <label>Unidad/Personal</label>
              <select v-model="usageData.assignedTo">
                <option value="U-37">Unidad U-37</option>
                <option value="U-78">Unidad U-78</option>
                <option value="U-67">Unidad U-67</option>
                <option value="almacen">Almacen</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Motivo/Incidente</label>
              <input type="text" v-model="usageData.reason" placeholder="Ej: Incidente INC-4589">
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showUsageModal = false">Cancelar</button>
          <button class="btn-primary" @click="registerUsage">Registrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EquipmentView',
  data() {
    return {
      selectedCategory: 'all',
      searchQuery: '',
      selectedEquipment: null,
      showAddModal: false,
      showEditModal: false,
      showUsageModal: false,
      newEquipment: {
        name: '',
        code: '',
        category: 'epp',
        quantity: 1,
        status: 'operativo',
        location: '',
        notes: ''
      },
      editingEquipment: {},
      usageEquipmentRef: null,
      usageData: {
        quantity: 1,
        assignedTo: 'U-37',
        reason: ''
      },
      statusLabels: {
        operativo: 'Operativo',
        mantenimiento: 'En Mant.',
        danado: 'Danado',
        vencido: 'Vencido'
      },
      categories: [
        { id: 'all', name: 'Todos', count: 48, color: 'blue', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
        { id: 'epp', name: 'EPP', count: 12, color: 'amber', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
        { id: 'hydraulic', name: 'Hidraulico', count: 8, color: 'red', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>` },
        { id: 'hoses', name: 'Mangueras', count: 10, color: 'green', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>` },
        { id: 'medical', name: 'Medico', count: 8, color: 'cyan', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
        { id: 'extinction', name: 'Extincion', count: 6, color: 'orange', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>` },
        { id: 'manual', name: 'Manual', count: 4, color: 'purple', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>` },
      ],
      equipment: [
        // EPP
        { id: 1, category: 'epp', name: 'Casco Estructural', code: 'EPP-001', quantity: 20, status: 'operativo', location: 'Almacen Principal', lastCheck: '15 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
        { id: 2, category: 'epp', name: 'Chaqueton Estructural', code: 'EPP-002', quantity: 18, status: 'operativo', location: 'Almacen Principal', lastCheck: '10 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>` },
        { id: 3, category: 'epp', name: 'Botas Estructurales', code: 'EPP-003', quantity: 16, status: 'operativo', location: 'Almacen Principal', lastCheck: '08 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 21h10v-3H7v3z"/><path d="M5 18h14v-2H5v2z"/><path d="M6 16l1-6h10l1 6"/><path d="M8 10V6a2 2 0 014 0v4"/></svg>` },
<<<<<<< HEAD
        { id: 4, category: 'epp', name: 'Guantes Estructurales', code: 'EPP-004', quantity: 24, status: 'operativo', location: 'Almacen Principal', lastCheck: '12 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 11V6a2 2 0 00-2-2itsioa2 2 0 00-2 2itsio"/><path d="M14 10V4a2 2 0 00-2-2itsioa2 2 0 00-2 2v2"/><path d="M10 10.5V6a2 2 0 00-2-2itsioa2 2 0 00-2 2v8"/><path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15"/></svg>` },
=======
        { id: 4, category: 'epp', name: 'Guantes Estructurales', code: 'EPP-004', quantity: 24, status: 'operativo', location: 'Almacen Principal', lastCheck: '12 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0"/><path d="M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2"/><path d="M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8"/><path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15"/></svg>` },
>>>>>>> 2c032c9b0204455cddd0d4768328096c74b63001
        { id: 5, category: 'epp', name: 'SCBA (ERA)', code: 'EPP-005', quantity: 12, status: 'operativo', location: 'Unidades', lastCheck: '20 May 2026', expiry: '20 Nov 2026', notes: 'Revision de cilindros programada', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="4" width="12" height="16" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 4v3"/></svg>` },
        { id: 6, category: 'epp', name: 'Monja Ignifuga', code: 'EPP-006', quantity: 22, status: 'operativo', location: 'Almacen Principal', lastCheck: '14 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 017-7h4a7 7 0 017 7v2"/></svg>` },
        // Hydraulic
        { id: 7, category: 'hydraulic', name: 'Cizalla Hidraulica', code: 'HYD-001', quantity: 2, status: 'operativo', location: 'U-37', lastCheck: '18 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>` },
        { id: 8, category: 'hydraulic', name: 'Separador Hidraulico', code: 'HYD-002', quantity: 2, status: 'operativo', location: 'U-37', lastCheck: '18 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16"/><path d="M4 18h16"/><path d="M12 6v12"/><path d="M8 6v4"/><path d="M16 14v4"/></svg>` },
        { id: 9, category: 'hydraulic', name: 'Bomba Hidraulica', code: 'HYD-003', quantity: 2, status: 'mantenimiento', location: 'Taller', lastCheck: '10 May 2026', notes: 'En revision preventiva', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>` },
        { id: 10, category: 'hydraulic', name: 'Cilindro Ram', code: 'HYD-004', quantity: 2, status: 'operativo', location: 'U-78', lastCheck: '15 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M8 8V6"/><path d="M16 8V6"/><path d="M8 16v2"/><path d="M16 16v2"/></svg>` },
        // Hoses
        { id: 11, category: 'hoses', name: 'Manguera 1.5"', code: 'MAN-001', quantity: 20, status: 'operativo', location: 'Almacen', lastCheck: '12 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z"/></svg>` },
        { id: 12, category: 'hoses', name: 'Manguera 2.5"', code: 'MAN-002', quantity: 15, status: 'operativo', location: 'Almacen', lastCheck: '12 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z"/></svg>` },
        { id: 13, category: 'hoses', name: 'Pitones Niebla', code: 'MAN-003', quantity: 8, status: 'operativo', location: 'Unidades', lastCheck: '14 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>` },
        { id: 14, category: 'hoses', name: 'Bifurcacion Y', code: 'MAN-004', quantity: 6, status: 'operativo', location: 'Almacen', lastCheck: '10 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3v12"/><path d="M18 9a3 3 0 100-6 3 3 0 000 6z"/><path d="M6 21a3 3 0 100-6 3 3 0 000 6z"/><path d="M18 21a3 3 0 100-6 3 3 0 000 6z"/><path d="M18 8a15 15 0 01-12 10"/></svg>` },
        // Medical
        { id: 15, category: 'medical', name: 'DEA', code: 'MED-001', quantity: 3, status: 'operativo', location: 'Unidades', lastCheck: '22 May 2026', expiry: '15 Dic 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
        { id: 16, category: 'medical', name: 'Tabla Espinal', code: 'MED-002', quantity: 4, status: 'operativo', location: 'Unidades', lastCheck: '18 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>` },
        { id: 17, category: 'medical', name: 'Collarines Cervicales', code: 'MED-003', quantity: 12, status: 'operativo', location: 'Almacen', lastCheck: '15 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>` },
        { id: 18, category: 'medical', name: 'Kit Trauma', code: 'MED-004', quantity: 4, status: 'operativo', location: 'Unidades', lastCheck: '20 May 2026', expiry: '01 Mar 2027', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>` },
        // Extinction
        { id: 19, category: 'extinction', name: 'Extintor PQS 9kg', code: 'EXT-001', quantity: 15, status: 'operativo', location: 'Estacion', lastCheck: '01 May 2026', expiry: '01 May 2027', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>` },
        { id: 20, category: 'extinction', name: 'Extintor CO2 5kg', code: 'EXT-002', quantity: 8, status: 'operativo', location: 'Estacion', lastCheck: '01 May 2026', expiry: '01 May 2027', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>` },
        // Manual tools
        { id: 21, category: 'manual', name: 'Hacha Pico', code: 'MAN-T01', quantity: 6, status: 'operativo', location: 'Unidades', lastCheck: '10 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>` },
        { id: 22, category: 'manual', name: 'Halligan Bar', code: 'MAN-T02', quantity: 4, status: 'operativo', location: 'Unidades', lastCheck: '10 May 2026', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4l16 16"/><path d="M4 8l4-4"/><path d="M16 20l4-4"/></svg>` },
        { id: 23, category: 'manual', name: 'Sierra Manual', code: 'MAN-T03', quantity: 3, status: 'danado', location: 'Taller', lastCheck: '05 May 2026', notes: 'Pendiente reparacion', icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18"/><path d="M3 6l3 12h12l3-12"/><path d="M8 6V4"/><path d="M16 6V4"/></svg>` },
      ]
    }
  },
  computed: {
    currentCategory() {
      return this.categories.find(c => c.id === this.selectedCategory)
    },
    filteredEquipment() {
      let items = this.equipment
      if (this.selectedCategory !== 'all') {
        items = items.filter(e => e.category === this.selectedCategory)
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        items = items.filter(e => 
          e.name.toLowerCase().includes(q) || 
          e.code.toLowerCase().includes(q)
        )
      }
      return items
    }
  },
  methods: {
    selectEquipment(item) {
      this.selectedEquipment = item
    },
    getCategoryName(catId) {
      const cat = this.categories.find(c => c.id === catId)
      return cat ? cat.name : catId
    },
    openEditModal() {
      // Store reference to the equipment being edited
      this.editingEquipment = { ...this.selectedEquipment }
      // Close the detail modal first
      this.selectedEquipment = null
      // Then open the edit modal
      this.showEditModal = true
    },
    openUsageModal() {
      // Store a reference to the equipment for usage
      this.usageEquipmentRef = this.selectedEquipment
      this.usageData = { quantity: 1, assignedTo: 'U-37', reason: '' }
      // Close the detail modal first  
      this.selectedEquipment = null
      // Then open usage modal
      this.showUsageModal = true
    },
    saveNewEquipment() {
      if (!this.newEquipment.name || !this.newEquipment.code) {
        alert('Por favor complete nombre y codigo')
        return
      }
      const newItem = {
        id: this.equipment.length + 1,
        ...this.newEquipment,
        lastCheck: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
      }
      this.equipment.push(newItem)
      
      // Update category count
      const cat = this.categories.find(c => c.id === newItem.category)
      if (cat) cat.count++
      const allCat = this.categories.find(c => c.id === 'all')
      if (allCat) allCat.count++
      
      // Reset form
      this.newEquipment = { name: '', code: '', category: 'epp', quantity: 1, status: 'operativo', location: '', notes: '' }
      this.showAddModal = false
    },
    saveEditedEquipment() {
      const idx = this.equipment.findIndex(e => e.id === this.editingEquipment.id)
      if (idx !== -1) {
        // Update the equipment with all edited fields
        this.equipment[idx] = { 
          ...this.equipment[idx], 
          name: this.editingEquipment.name,
          category: this.editingEquipment.category,
          quantity: parseInt(this.editingEquipment.quantity),
          status: this.editingEquipment.status,
          location: this.editingEquipment.location,
          notes: this.editingEquipment.notes,
          lastCheck: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
        }
      }
      this.showEditModal = false
      this.editingEquipment = {}
    },
    registerUsage() {
      if (!this.usageData.reason) {
        alert('Por favor indique el motivo o incidente')
        return
      }
      // Use the stored reference
      const equipRef = this.usageEquipmentRef
      if (equipRef) {
        const qty = parseInt(this.usageData.quantity)
        if (qty > equipRef.quantity) {
          alert('No hay suficiente cantidad disponible')
          return
        }
        // Find and update the equipment in the array
        const idx = this.equipment.findIndex(e => e.id === equipRef.id)
        if (idx !== -1) {
          this.equipment[idx].quantity -= qty
          this.equipment[idx].lastCheck = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
        }
      }
      this.showUsageModal = false
      this.usageEquipmentRef = null
    }
  }
}
</script>

<style scoped>
.equipment-view { padding-top: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }
.view-header { display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
.view-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--text-primary); letter-spacing: 0.06em; }

.header-actions { display: flex; gap: 8px; }
.hdr-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  font-family: var(--font-display); font-size: 0.8rem; font-weight: 600;
  letter-spacing: 0.06em; border-radius: var(--radius);
  border: 1px solid rgba(220,38,38,0.3); background: rgba(220,38,38,0.1);
  color: var(--accent-secondary); cursor: pointer; transition: all 0.2s;
}
.hdr-btn:hover { background: rgba(220,38,38,0.18); }

/* Categories */
.categories-grid {
  display: flex; gap: 8px; flex-shrink: 0; overflow-x: auto;
  padding-bottom: 4px;
}

.category-card {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; background: var(--bg-card);
  border: 1px solid var(--border-subtle); border-radius: var(--radius);
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.category-card:hover { border-color: var(--border-accent); background: var(--bg-card-hover); }
.category-card--active { border-color: var(--accent-secondary); background: rgba(220,38,38,0.08); }

.cat-icon {
  width: 36px; height: 36px; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
}
.cat-icon--blue { background: rgba(59,130,246,0.1); color: var(--accent-blue); }
.cat-icon--amber { background: rgba(245,158,11,0.1); color: var(--accent-amber); }
.cat-icon--red { background: rgba(220,38,38,0.1); color: var(--accent-secondary); }
.cat-icon--green { background: var(--accent-green-glow); color: var(--accent-green); }
.cat-icon--cyan { background: rgba(6,182,212,0.1); color: #06b6d4; }
.cat-icon--orange { background: rgba(249,115,22,0.1); color: var(--accent-orange); }
.cat-icon--purple { background: rgba(168,85,247,0.1); color: #a855f7; }

.cat-info { display: flex; flex-direction: column; }
.cat-name { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
.cat-count { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.05em; }

/* Equipment content */
.equipment-content {
  flex: 1; display: flex; flex-direction: column; gap: 12px;
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); padding: 16px; overflow: hidden;
}

.content-header { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.content-title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--text-primary); }

.search-box {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; background: var(--bg-secondary);
  border: 1px solid var(--border-subtle); border-radius: var(--radius);
  color: var(--text-muted);
}
.search-box input {
  background: none; border: none; outline: none;
  font-family: var(--font-body); font-size: 0.8rem;
  color: var(--text-primary); width: 180px;
}
.search-box input::placeholder { color: var(--text-muted); }

/* Equipment grid */
.equipment-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px; overflow-y: auto; flex: 1;
}

.equipment-card {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 14px;
  cursor: pointer; transition: all 0.2s;
  display: flex; flex-direction: column; gap: 10px;
}
.equipment-card:hover { border-color: var(--border-accent); background: var(--bg-card-hover); transform: translateY(-2px); }

.eq-image {
  height: 60px; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.2); border-radius: var(--radius);
}
.eq-placeholder { color: var(--text-muted); }

.eq-info { display: flex; flex-direction: column; gap: 2px; }
.eq-name { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
.eq-code { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.1em; }

.eq-meta { display: flex; align-items: center; justify-content: space-between; }
.eq-status {
  font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.1em;
  padding: 2px 6px; border-radius: 2px;
}
.eq-status--operativo { background: var(--accent-green-glow); color: var(--accent-green); }
.eq-status--mantenimiento { background: rgba(245,158,11,0.1); color: var(--accent-amber); }
.eq-status--danado { background: rgba(239,68,68,0.1); color: var(--accent-red); }
.eq-status--vencido { background: rgba(239,68,68,0.1); color: var(--accent-red); }

.eq-qty { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); }

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8); display: flex;
  align-items: center; justify-content: center; z-index: 1000;
}

.modal-content {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); width: 500px; max-width: 90vw;
}
.modal-lg { width: 600px; }

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

.modal-body { padding: 20px; }

.detail-grid { display: grid; grid-template-columns: 120px 1fr; gap: 20px; }

.detail-image {
  background: var(--bg-secondary); border-radius: var(--radius);
  height: 120px; display: flex; align-items: center; justify-content: center;
}
.eq-placeholder-lg { color: var(--text-muted); }

.detail-info { display: flex; flex-direction: column; gap: 8px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; }
.detail-label { font-family: var(--font-mono); font-size: 0.58rem; color: var(--text-muted); letter-spacing: 0.1em; }
.detail-value { font-family: var(--font-body); font-size: 0.8rem; color: var(--text-primary); }
.detail-value--warn { color: var(--accent-amber); }

.detail-status {
  font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em;
  padding: 2px 8px; border-radius: 2px;
}
.detail-status--operativo { background: var(--accent-green-glow); color: var(--accent-green); }
.detail-status--mantenimiento { background: rgba(245,158,11,0.1); color: var(--accent-amber); }
.detail-status--danado { background: rgba(239,68,68,0.1); color: var(--accent-red); }

.detail-notes {
  margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-subtle);
}
.detail-notes p {
  margin: 6px 0 0; font-family: var(--font-body); font-size: 0.8rem;
  color: var(--text-secondary); line-height: 1.5;
}

.modal-actions {
  display: flex; justify-content: flex-end; gap: 8px;
  padding: 16px 20px; border-top: 1px solid var(--border-subtle);
}

.btn-secondary, .btn-primary {
  padding: 8px 16px; border-radius: var(--radius);
  font-family: var(--font-display); font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.btn-secondary {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}
.btn-secondary:hover { border-color: var(--border-accent); color: var(--text-primary); }
.btn-primary {
  background: var(--accent-secondary); border: 1px solid var(--accent-secondary);
  color: white;
}
.btn-primary:hover { background: #b91c1c; }
</style>
