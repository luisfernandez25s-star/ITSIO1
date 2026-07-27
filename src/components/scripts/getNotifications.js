import { api } from '@/utils/api'

// ---- Datos (desde la API) ----
export async function getNotifications() {
  const list = await api.get('/notifications')
  return list.map(n => ({
    ...n,
    createdAt: n.createdAt ? new Date(n.createdAt) : null,
    readAt: n.readAt ? new Date(n.readAt) : null
  }))
}

export async function getUnreadCount() {
  const { count } = await api.get('/notifications/unread-count')
  return count
}

export async function markAsRead(id) {
  return api.patch(`/notifications/${id}/read`, {})
}

export async function markAllAsRead() {
  return api.post('/notifications/read-all', {})
}

// ---- Helpers (sin cambios) ----
export function formatTimeAgo(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `hace ${minutes} min`
  if (hours < 24) return `hace ${hours}h`
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`
  return new Date(date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
}

export function getNotificationIcon(type) {
  const icons = {
    mantenimiento: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    certificacion: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    guardia: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    inventario: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    sistema: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    incidente: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  }
  return icons[type] || icons.sistema
}

export function getPriorityColor(priority) {
  const colors = {
    critica: 'var(--accent-red)',
    alta: 'var(--accent-orange)',
    normal: 'var(--accent-blue)',
    baja: 'var(--text-secondary)'
  }
  return colors[priority] || colors.normal
}
