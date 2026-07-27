<template>
  <div class="notifications-view">
    <header class="view-header">
      <div class="header-content">
        <span class="section-tag">// CENTRO DE NOTIFICACIONES</span>
        <h1 class="view-title">Alertas y Notificaciones</h1>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="markAllRead">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Marcar todas leídas
        </button>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-icon" style="color: var(--accent-red)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <div class="summary-data">
          <span class="summary-value">{{ unreadCount }}</span>
          <span class="summary-label">Sin Leer</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="color: var(--accent-orange)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          </svg>
        </div>
        <div class="summary-data">
          <span class="summary-value">{{ criticalCount }}</span>
          <span class="summary-label">Críticas</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="color: var(--accent-blue)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="summary-data">
          <span class="summary-value">{{ todayCount }}</span>
          <span class="summary-label">Hoy</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="color: var(--accent-green)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div class="summary-data">
          <span class="summary-value">{{ readCount }}</span>
          <span class="summary-label">Leídas</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-tabs">
        <button 
          v-for="tab in filterTabs" 
          :key="tab.value"
          class="filter-tab"
          :class="{ 'is-active': activeFilter === tab.value }"
          @click="activeFilter = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="notifications-list">
      <div 
        v-for="notif in filteredNotifications" 
        :key="notif.id"
        class="notification-card"
        :class="{ 'is-unread': !notif.readAt }"
        @click="handleClick(notif)"
      >
        <div class="notif-priority-bar" :style="{ background: getPriorityColor(notif.priority) }"></div>
        
        <div class="notif-icon" :style="{ color: getPriorityColor(notif.priority) }" v-html="getNotificationIcon(notif.type)"></div>
        
        <div class="notif-main">
          <div class="notif-header">
            <span class="notif-title">{{ notif.title }}</span>
            <span class="notif-type-badge" :class="'type-' + notif.type">{{ getTypeLabel(notif.type) }}</span>
          </div>
          <p class="notif-message">{{ notif.message }}</p>
          <div class="notif-meta">
            <span class="notif-time">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ formatTimeAgo(notif.createdAt) }}
            </span>
            <span v-if="notif.readAt" class="notif-read">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 11 12 14 22 4"/>
              </svg>
              Leída
            </span>
          </div>
        </div>

        <div class="notif-actions">
          <button v-if="notif.actionUrl" class="action-link" @click.stop="$router.push(notif.actionUrl)">
            Ver detalles
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="empty-title">No hay notificaciones</span>
        <span class="empty-subtitle">No se encontraron notificaciones con el filtro seleccionado</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotifications, formatTimeAgo, getNotificationIcon, getPriorityColor } from '@/components/scripts/getNotifications.js'

export default {
  name: 'NotificationsView',
  data() {
    return {
      notifications: [],
      activeFilter: 'todas',
      filterTabs: [
        { label: 'Todas', value: 'todas' },
        { label: 'Sin Leer', value: 'unread' },
        { label: 'Críticas', value: 'critica' },
        { label: 'Mantenimiento', value: 'mantenimiento' },
        { label: 'Certificaciones', value: 'certificacion' },
        { label: 'Inventario', value: 'inventario' }
      ]
    }
  },
  computed: {
    filteredNotifications() {
      if (this.activeFilter === 'todas') return this.notifications
      if (this.activeFilter === 'unread') return this.notifications.filter(n => !n.readAt)
      if (this.activeFilter === 'critica') return this.notifications.filter(n => n.priority === 'critica' || n.priority === 'alta')
      return this.notifications.filter(n => n.type === this.activeFilter)
    },
    unreadCount() {
      return this.notifications.filter(n => !n.readAt).length
    },
    criticalCount() {
      return this.notifications.filter(n => n.priority === 'critica' || n.priority === 'alta').length
    },
    todayCount() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return this.notifications.filter(n => new Date(n.createdAt) >= today).length
    },
    readCount() {
      return this.notifications.filter(n => n.readAt).length
    }
  },
  async mounted() {
    this.notifications = await getNotifications()
  },
  methods: {
    formatTimeAgo,
    getNotificationIcon,
    getPriorityColor,
    getTypeLabel(type) {
      const labels = {
        mantenimiento: 'Mantenimiento',
        certificacion: 'Certificación',
        guardia: 'Guardia',
        inventario: 'Inventario',
        sistema: 'Sistema',
        incidente: 'Incidente'
      }
      return labels[type] || type
    },
    handleClick(notif) {
      if (!notif.readAt) {
        notif.readAt = new Date()
      }
    },
    markAllRead() {
      this.notifications = this.notifications.map(n => ({ ...n, readAt: n.readAt || new Date() }))
    }
  }
}
</script>

<style scoped>
.notifications-view {
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
  letter-spacing: 0.04em;
  margin: 4px 0 0 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
}
.action-btn:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
  border-color: var(--border-accent);
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.summary-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-data {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.summary-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Filters */
.filters-bar {
  display: flex;
  gap: 8px;
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

/* Notifications List */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
}

.notification-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  overflow: hidden;
}
.notification-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-accent);
}
.notification-card.is-unread {
  background: rgba(220,38,38,0.03);
}

.notif-priority-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}

.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  background: rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-main {
  flex: 1;
  min-width: 0;
}

.notif-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.notif-title {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.notif-type-badge {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  padding: 2px 8px;
  border-radius: 2px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.type-mantenimiento { background: rgba(59,130,246,0.15); color: var(--accent-blue); }
.type-certificacion { background: rgba(245,158,11,0.15); color: var(--accent-amber); }
.type-guardia { background: rgba(34,197,94,0.15); color: var(--accent-green); }
.type-inventario { background: rgba(249,115,22,0.15); color: var(--accent-orange); }
.type-sistema { background: rgba(139,146,165,0.15); color: var(--text-secondary); }
.type-incidente { background: rgba(239,68,68,0.15); color: var(--accent-red); }

.notif-message {
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.notif-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notif-time,
.notif-read {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}
.notif-read { color: var(--accent-green); }

.notif-actions {
  display: flex;
  align-items: center;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--accent-secondary);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.15s;
}
.action-link:hover {
  background: rgba(220,38,38,0.1);
  border-color: var(--border-accent);
}

/* Empty State */
.empty-state {
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
</style>
