import { api } from '@/utils/api'

// ---- Datos (desde la API) ----
export async function getDispatchQueue() {
  const list = await api.get('/dispatch/queue')
  return list.map(d => ({ ...d, receivedAt: d.receivedAt ? new Date(d.receivedAt) : null }))
}

export async function getUnitStatus() {
  const units = await api.get('/dispatch/units')
  // La API entrega el estado base de cada unidad; complementamos campos
  // que la vista espera para mostrar la tarjeta de la unidad.
  return units.map(u => ({
    unitId: u.unitId,
    type: u.type,
    status: u.status,
    currentIncident: null,
    crew: [],
    crewCount: 0,
    lastUpdate: new Date(),
    location: u.status === 'disponible' ? 'Estación Central' : 'Taller'
  }))
}

export async function getAvailableUnits() {
  const units = await getUnitStatus()
  return units.filter(u => u.status === 'disponible')
}

export async function getActiveUnits() {
  const units = await getUnitStatus()
  return units.filter(u => ['en_ruta', 'en_escena', 'atendiendo'].includes(u.status))
}

// Personal certificado para la guardia de hoy (derivado de /personnel)
export async function getCertifiedPersonnelForDispatch() {
  const currentGuard = getCurrentGuard()
  const personnel = await api.get('/personnel')
  return personnel
    .filter(p => p.guard === currentGuard && p.expiredCerts === 0)
    .map(p => ({
      id: p.id,
      name: p.name,
      guard: p.guard,
      rank: p.rank,
      initials: p.initials,
      allCertsValid: p.expiredCerts === 0,
      expiredCerts: p.expiredCerts,
      totalCerts: p.totalCerts
    }))
}

// ---- Helpers (sin cambios) ----
export function getUnitStatusLabel(status) {
  const labels = {
    disponible: 'Disponible',
    en_ruta: 'En Ruta',
    en_escena: 'En Escena',
    atendiendo: 'Atendiendo',
    regresando: 'Regresando',
    fuera_servicio: 'Fuera de Servicio'
  }
  return labels[status] || status
}

export function getUnitStatusClass(status) {
  const classes = {
    disponible: 'unit-disponible',
    en_ruta: 'unit-en-ruta',
    en_escena: 'unit-en-escena',
    atendiendo: 'unit-atendiendo',
    regresando: 'unit-regresando',
    fuera_servicio: 'unit-fuera-servicio'
  }
  return classes[status] || ''
}

export function getDispatchStatusLabel(status) {
  const labels = {
    pendiente: 'Pendiente',
    asignado: 'Asignado',
    en_ruta: 'En Ruta'
  }
  return labels[status] || status
}

// Guardia actual segun rotacion de 4 dias
export function getCurrentGuard() {
  const refDate = new Date(2026, 0, 1) // 1 Ene 2026 = Guardia A
  const today = new Date()
  const diffDays = Math.floor((today - refDate) / (1000 * 60 * 60 * 24))
  const guards = ['A', 'B', 'C', 'D']
  return guards[((diffDays % 4) + 4) % 4]
}
