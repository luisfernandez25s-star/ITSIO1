import { api } from '@/utils/api'

// ---- Datos (desde la API) ----
export async function getIncidents() {
  const list = await api.get('/incidents')
  return list.map(normalizeIncident)
}

export async function getIncidentById(id) {
  const inc = await api.get(`/incidents/${id}`)
  return normalizeIncident(inc)
}

export async function getActiveIncidents() {
  const list = await api.get('/incidents/active')
  return list.map(normalizeIncident)
}

// Mutaciones
export async function addIncidentNote(id, author, text) {
  return api.post(`/incidents/${id}/notes`, { author, text })
}

export async function updateIncidentStatus(id, status) {
  return api.patch(`/incidents/${id}`, { status })
}

export async function createIncident(payload) {
  return api.post('/incidents', payload)
}

// Convierte las fechas string del JSON a objetos Date (como esperaban las vistas)
function normalizeIncident(i) {
  if (!i) return i
  const toDate = (v) => (v ? new Date(v) : null)
  return {
    ...i,
    reportedAt: toDate(i.reportedAt),
    dispatchedAt: toDate(i.dispatchedAt),
    arrivedAt: toDate(i.arrivedAt),
    closedAt: toDate(i.closedAt),
    notes: (i.notes || []).map(n => ({ ...n, time: toDate(n.time) }))
  }
}

// ---- Helpers de presentacion (sin cambios) ----
export function getIncidentTypeLabel(type) {
  const labels = {
    incendio: 'Incendio',
    rescate: 'Rescate',
    emergencia_medica: 'Emergencia Médica',
    hazmat: 'Mat. Peligrosos',
    servicio: 'Servicio'
  }
  return labels[type] || type
}

export function getIncidentStatusLabel(status) {
  const labels = {
    activo: 'Activo',
    en_ruta: 'En Ruta',
    atendiendo: 'Atendiendo',
    cerrado: 'Cerrado'
  }
  return labels[status] || status
}

export function getIncidentTypeIcon(type) {
  const icons = {
    incendio: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    rescate: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    emergencia_medica: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    hazmat: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    servicio: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  }
  return icons[type] || icons.servicio
}

export function getPriorityClass(priority) {
  const classes = {
    alta: 'priority-alta',
    media: 'priority-media',
    baja: 'priority-baja'
  }
  return classes[priority] || ''
}

export function getStatusClass(status) {
  const classes = {
    activo: 'status-activo',
    en_ruta: 'status-en-ruta',
    atendiendo: 'status-atendiendo',
    cerrado: 'status-cerrado'
  }
  return classes[status] || ''
}
