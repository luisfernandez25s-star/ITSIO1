// ============================================================
// ITSIO - Datos en memoria (fallback)
// Se usa cuando NO hay una base de datos PostgreSQL disponible
// (por ejemplo en la vista previa sin DATABASE_URL).
// Reproduce los mismos datos que database/seed.sql y respeta
// el contrato de cada endpoint del API real.
// ============================================================
import express from 'express'

// Helpers de fecha relativos a "ahora"
const min = (n) => new Date(Date.now() - n * 60 * 1000).toISOString()
const hrs = (n) => min(n * 60)
const days = (n) => min(n * 60 * 24)
const future = (n) => new Date(Date.now() + n * 60 * 1000).toISOString()

// ------------------------------------------------------------
// Vehiculos
// ------------------------------------------------------------
const vehicleTypes = [
  { type: 'Motobomba', img: 'motobomba' },
  { type: 'Escala', img: 'escala' },
  { type: 'Rapida', img: 'pick-up' },
  { type: 'Sedan', img: 'sedan' },
  { type: 'Pipa-Motobomba', img: 'pipa-motobomba' }
]

const vehicles = [
  { numberUnit: '67', type: 'Motobomba', img: 'motobomba', status: 'operativa', model: 'dumie', carBrand: 'Ford', placas: 'biuuiu', kilometraje: 180408 },
  { numberUnit: '66', type: 'Motobomba', img: 'motobomba', status: 'operativa', model: 'dumie', carBrand: 'Ford', placas: 'biuuiu', kilometraje: 175300 },
  { numberUnit: '65', type: 'Escala', img: 'escala', status: 'operativa', model: 'dumie', carBrand: 'Ford', placas: 'biuuiu', kilometraje: 180408 },
  { numberUnit: '69', type: 'Escala', img: 'escala', status: 'in-operativa', model: 'dumie', carBrand: 'Ford', placas: 'biuuiu', kilometraje: 180408 },
  { numberUnit: '72', type: 'Escala', img: 'escala', status: 'in-operativa', model: 'dumie', carBrand: 'Ford', placas: 'biuuiu', kilometraje: 180408 },
  { numberUnit: '78', type: 'Rapida', img: 'reaction/u78/u-78right', status: 'taller', model: '2024', carBrand: 'Cheyene', placas: 'CFL-124-M', kilometraje: 5200 },
  { numberUnit: '37', type: 'Rapida', img: 'reaction/u37/u-37right', status: 'operativa', model: '2014', carBrand: 'Mitsubishi', placas: 'biuuiu', kilometraje: 49850 },
  { numberUnit: '14', type: 'Rapida', img: 'reaction/dumie', status: 'operativa', model: 'dumie', carBrand: 'Ford', placas: 'biuuiu', kilometraje: 180408 },
  { numberUnit: '28', type: 'Rapida', img: 'reaction/dumie', status: 'operativa', model: 'dumie', carBrand: 'Ford', placas: 'biuuiu', kilometraje: 62400 },
  { numberUnit: '45', type: 'Rapida', img: 'reaction/dumie', status: 'in-operativa', model: 'dumie', carBrand: 'Ford', placas: 'biuuiu', kilometraje: 180408 },
  { numberUnit: '56', type: 'Sedan', img: 'pick-up', status: 'in-operativa', model: 'dumie', carBrand: 'Ford', placas: 'biuuiu', kilometraje: 180408 }
]

// ------------------------------------------------------------
// Personal
// ------------------------------------------------------------
const personnel = [
  { id: 1, name: 'Cap. Jorge Garcia', rank: 'Capitan', guard: 'A', initials: 'JG', avatarColor: '#dc2626', hoursTraining: 240, skills: { combate_incendio: 5, rescate: 4, hazmat: 3, medica: 4, conduccion: 4 } },
  { id: 2, name: 'Tte. Roberto Sanchez', rank: 'Teniente', guard: 'A', initials: 'RS', avatarColor: '#2563eb', hoursTraining: 180, skills: { combate_incendio: 4, rescate: 5, hazmat: 4, medica: 3, conduccion: 5 } },
  { id: 3, name: 'Bro. Carlos Mendez', rank: 'Bombero', guard: 'B', initials: 'CM', avatarColor: '#16a34a', hoursTraining: 120, skills: { combate_incendio: 3, rescate: 4, hazmat: 2, medica: 4, conduccion: 3 } },
  { id: 4, name: 'Bro. Luis Hernandez', rank: 'Bombero', guard: 'B', initials: 'LH', avatarColor: '#9333ea', hoursTraining: 90, skills: { combate_incendio: 2, rescate: 3, hazmat: 1, medica: 2, conduccion: 3 } },
  { id: 5, name: 'Bro. Pedro Ramirez', rank: 'Bombero', guard: 'C', initials: 'PR', avatarColor: '#ea580c', hoursTraining: 150, skills: { combate_incendio: 4, rescate: 5, hazmat: 3, medica: 3, conduccion: 4 } },
  { id: 6, name: 'Bro. Ana Lopez', rank: 'Bombero', guard: 'C', initials: 'AL', avatarColor: '#0891b2', hoursTraining: 110, skills: { combate_incendio: 3, rescate: 3, hazmat: 2, medica: 4, conduccion: 3 } },
  { id: 7, name: 'Bro. Miguel Torres', rank: 'Bombero', guard: 'D', initials: 'MT', avatarColor: '#4f46e5', hoursTraining: 100, skills: { combate_incendio: 3, rescate: 3, hazmat: 2, medica: 3, conduccion: 3 } },
  { id: 8, name: 'Bro. Sofia Ruiz', rank: 'Bombero', guard: 'D', initials: 'SR', avatarColor: '#be185d', hoursTraining: 80, skills: { combate_incendio: 2, rescate: 2, hazmat: 1, medica: 3, conduccion: 2 } },
  { id: 9, name: 'Tte. Andres Molina', rank: 'Teniente', guard: 'A', initials: 'AM', avatarColor: '#0d9488', hoursTraining: 160, skills: { combate_incendio: 4, rescate: 4, hazmat: 3, medica: 3, conduccion: 4 } },
  { id: 10, name: 'Bro. Ivan Reyes', rank: 'Bombero', guard: 'A', initials: 'IR', avatarColor: '#65a30d', hoursTraining: 95, skills: { combate_incendio: 3, rescate: 3, hazmat: 2, medica: 3, conduccion: 3 } },
  { id: 11, name: 'Bro. Gabriel Moreno', rank: 'Bombero', guard: 'B', initials: 'GM', avatarColor: '#c026d3', hoursTraining: 130, skills: { combate_incendio: 3, rescate: 4, hazmat: 2, medica: 3, conduccion: 4 } },
  { id: 12, name: 'Bro. Hector Vargas', rank: 'Bombero', guard: 'B', initials: 'HV', avatarColor: '#0284c7', hoursTraining: 105, skills: { combate_incendio: 3, rescate: 3, hazmat: 2, medica: 3, conduccion: 3 } },
  { id: 13, name: 'Bro. Eduardo Diaz', rank: 'Bombero', guard: 'C', initials: 'ED', avatarColor: '#d97706', hoursTraining: 125, skills: { combate_incendio: 3, rescate: 4, hazmat: 3, medica: 3, conduccion: 4 } },
  { id: 14, name: 'Bro. Fernando Castro', rank: 'Bombero', guard: 'C', initials: 'FC', avatarColor: '#7c3aed', hoursTraining: 100, skills: { combate_incendio: 3, rescate: 3, hazmat: 2, medica: 3, conduccion: 3 } },
  { id: 15, name: 'Bro. Leonardo Ruiz', rank: 'Bombero', guard: 'D', initials: 'LR', avatarColor: '#059669', hoursTraining: 90, skills: { combate_incendio: 2, rescate: 3, hazmat: 2, medica: 3, conduccion: 3 } },
  { id: 16, name: 'Bro. Manuel Santos', rank: 'Bombero', guard: 'D', initials: 'MS', avatarColor: '#dc2626', hoursTraining: 115, skills: { combate_incendio: 3, rescate: 3, hazmat: 2, medica: 3, conduccion: 4 } }
]

// ------------------------------------------------------------
// Certificaciones
// ------------------------------------------------------------
const certifications = [
  { id: 1, personnelId: 1, name: 'Primeros Auxilios Avanzados', category: 'obligatorio', status: 'active', issuedDate: '2024-03-15', expiryDate: '2026-03-15', institution: 'Cruz Roja Mexicana' },
  { id: 2, personnelId: 1, name: 'Combate de Incendios Estructurales', category: 'obligatorio', status: 'active', issuedDate: '2023-08-20', expiryDate: '2025-08-20', institution: 'Academia de Bomberos' },
  { id: 3, personnelId: 1, name: 'Manejo de Materiales Peligrosos', category: 'especialidad', status: 'expiring', issuedDate: '2024-01-10', expiryDate: '2026-07-10', institution: 'CENAPRED' },
  { id: 4, personnelId: 1, name: 'Rescate Vehicular', category: 'especialidad', status: 'active', issuedDate: '2024-01-25', expiryDate: '2026-07-15', institution: 'Academia de Bomberos' },
  { id: 5, personnelId: 2, name: 'Primeros Auxilios Basicos', category: 'obligatorio', status: 'active', issuedDate: '2023-11-15', expiryDate: '2025-11-15', institution: 'Cruz Roja Mexicana' },
  { id: 6, personnelId: 2, name: 'HAZMAT Nivel Operaciones', category: 'especialidad', status: 'expired', issuedDate: '2022-05-10', expiryDate: '2024-05-10', institution: 'CENAPRED' },
  { id: 7, personnelId: 2, name: 'Rescate en Alturas', category: 'especialidad', status: 'active', issuedDate: '2024-06-01', expiryDate: '2026-06-01', institution: 'STPS' },
  { id: 8, personnelId: 3, name: 'Combate de Incendios', category: 'obligatorio', status: 'expiring', issuedDate: '2023-07-20', expiryDate: '2026-07-05', institution: 'Academia de Bomberos' },
  { id: 9, personnelId: 3, name: 'Primeros Auxilios', category: 'obligatorio', status: 'active', issuedDate: '2024-02-10', expiryDate: '2026-02-10', institution: 'Cruz Roja Mexicana' },
  { id: 10, personnelId: 4, name: 'Conduccion de Emergencia', category: 'complementario', status: 'expired', issuedDate: '2022-09-01', expiryDate: '2024-09-01', institution: 'Secretaria de Movilidad' },
  { id: 11, personnelId: 5, name: 'Rescate en Alturas', category: 'especialidad', status: 'active', issuedDate: '2024-06-01', expiryDate: '2026-06-01', institution: 'STPS' },
  { id: 12, personnelId: 6, name: 'Primeros Auxilios Basicos', category: 'obligatorio', status: 'expiring', issuedDate: '2023-11-15', expiryDate: '2026-06-30', institution: 'Cruz Roja Mexicana' },
  { id: 13, personnelId: 7, name: 'Uso de SCBA', category: 'obligatorio', status: 'active', issuedDate: '2023-09-10', expiryDate: '2025-09-10', institution: 'Academia de Bomberos' },
  { id: 14, personnelId: 8, name: 'Combate de Incendios Basico', category: 'obligatorio', status: 'expired', issuedDate: '2022-03-15', expiryDate: '2024-03-15', institution: 'Academia de Bomberos' }
]

const daysBetween = (dateStr) => Math.max(0, Math.round((new Date(dateStr) - Date.now()) / (1000 * 60 * 60 * 24)))

// ------------------------------------------------------------
// Cursos
// ------------------------------------------------------------
const courses = [
  { id: 1, title: 'Actualizacion en Rescate Vehicular', type: 'curso', scheduledDate: future(60 * 24 * 3), duration: 16, instructor: 'Instructor Ext. Manuel Vega', maxCapacity: 12, status: 'programado', location: 'Estacion Central', attendees: [1, 2, 3, 5] },
  { id: 2, title: 'Simulacro de Incendio Estructural', type: 'simulacro', scheduledDate: future(60 * 24 * 7), duration: 4, instructor: 'Cap. Jorge Garcia', maxCapacity: 20, status: 'programado', location: 'Campo de Practicas Norte', attendees: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 3, title: 'Mantenimiento de Equipo Hidraulico', type: 'practica', scheduledDate: days(2), duration: 8, instructor: 'Tte. Roberto Sanchez', maxCapacity: 8, status: 'completado', location: 'Taller de Equipo', attendees: [3, 4, 6] },
  { id: 4, title: 'Curso HAZMAT Nivel Operaciones', type: 'curso', scheduledDate: future(60 * 24 * 14), duration: 40, instructor: 'CENAPRED', maxCapacity: 10, status: 'programado', location: 'Centro de Capacitacion CENAPRED', attendees: [2, 5] },
  { id: 5, title: 'Practica de Conduccion de Emergencia', type: 'practica', scheduledDate: new Date().toISOString(), duration: 6, instructor: 'Tte. Roberto Sanchez', maxCapacity: 6, status: 'en_curso', location: 'Circuito de Practicas', attendees: [4, 7, 8] }
]

// ------------------------------------------------------------
// Incidentes
// ------------------------------------------------------------
const incidents = [
  {
    id: 1, type: 'incendio', subtype: 'estructural', priority: 'alta', status: 'cerrado',
    location: { address: 'Av. Revolucion 1234, Col. Centro', lat: 19.4326, lng: -99.1332 },
    reportedAt: hrs(2), dispatchedAt: min(117), arrivedAt: min(112), closedAt: min(30),
    description: 'Incendio en bodega de productos quimicos. Se reporta humo negro visible.',
    assignedUnits: ['U-37', 'U-67'], assignedPersonnel: [1, 2, 5, 8, 12],
    notes: [
      { time: min(90), author: 'TTE. Sanchez', text: 'Fuego controlado en primer nivel.' },
      { time: min(60), author: 'CAP. Garcia', text: 'Liquidacion completada. Sin victimas.' }
    ],
    resources: { waterUsed: 8500, foamUsed: 200, equipmentUsed: ['Escalera', 'Hacha', 'Mangueras 2.5"'] },
    responseTime: 8
  },
  {
    id: 2, type: 'rescate', subtype: 'vehicular', priority: 'alta', status: 'atendiendo',
    location: { address: 'Periferico Sur km 15.5', lat: 19.3034, lng: -99.1954 },
    reportedAt: min(25), dispatchedAt: min(23), arrivedAt: min(15), closedAt: null,
    description: 'Colision multiple. 2 vehiculos involucrados, persona atrapada.',
    assignedUnits: ['U-78', 'U-14'], assignedPersonnel: [3, 6, 9, 11],
    notes: [{ time: min(10), author: 'BRO. Mendez', text: 'Iniciando corte con equipo hidraulico.' }],
    resources: { waterUsed: 0, foamUsed: 0, equipmentUsed: ['Equipo Hidraulico', 'Camilla', 'Collarin'] },
    responseTime: 10
  },
  {
    id: 3, type: 'emergencia_medica', subtype: 'paro_cardiaco', priority: 'alta', status: 'en_ruta',
    location: { address: 'Plaza Comercial Norte, Local 45', lat: 19.4523, lng: -99.0876 },
    reportedAt: min(5), dispatchedAt: min(4), arrivedAt: null, closedAt: null,
    description: 'Hombre de aproximadamente 60 anios con posible paro cardiaco.',
    assignedUnits: ['U-28'], assignedPersonnel: [4, 7],
    notes: [],
    resources: { waterUsed: 0, foamUsed: 0, equipmentUsed: ['DEA', 'Equipo de RCP'] },
    responseTime: null
  },
  {
    id: 4, type: 'hazmat', subtype: 'derrame', priority: 'media', status: 'cerrado',
    location: { address: 'Zona Industrial Vallejo, Nave 8', lat: 19.4856, lng: -99.1432 },
    reportedAt: hrs(24), dispatchedAt: min(1435), arrivedAt: min(1428), closedAt: hrs(20),
    description: 'Derrame de solvente industrial. Area acordonada por PROFEPA.',
    assignedUnits: ['U-67', 'U-66'], assignedPersonnel: [1, 2, 3, 5, 8, 10],
    notes: [
      { time: hrs(22), author: 'CAP. Garcia', text: 'Material identificado como acetona. Aplicando protocolo HAZMAT.' },
      { time: hrs(21), author: 'TTE. Sanchez', text: 'Contencion completada. Entrega a empresa especializada.' }
    ],
    resources: { waterUsed: 500, foamUsed: 0, equipmentUsed: ['Traje HAZMAT', 'Kit de contencion', 'Detector de gases'] },
    responseTime: 12
  },
  {
    id: 5, type: 'servicio', subtype: 'retiro_enjambre', priority: 'baja', status: 'activo',
    location: { address: 'Escuela Primaria Benito Juarez', lat: 19.3987, lng: -99.1654 },
    reportedAt: min(45), dispatchedAt: min(40), arrivedAt: min(30), closedAt: null,
    description: 'Enjambre de abejas en area de juegos infantiles.',
    assignedUnits: ['U-45'], assignedPersonnel: [13, 14],
    notes: [{ time: min(25), author: 'BRO. Lopez', text: 'Area evacuada. Iniciando procedimiento de retiro.' }],
    resources: { waterUsed: 0, foamUsed: 0, equipmentUsed: ['Traje apicultor', 'Fumigador'] },
    responseTime: 15
  },
  {
    id: 6, type: 'incendio', subtype: 'vehicular', priority: 'media', status: 'cerrado',
    location: { address: 'Estacionamiento Centro Comercial Sur', lat: 19.3234, lng: -99.1876 },
    reportedAt: hrs(48), dispatchedAt: min(2878), arrivedAt: min(2873), closedAt: hrs(47),
    description: 'Vehiculo sedan en llamas. Sin personas en el interior.',
    assignedUnits: ['U-37'], assignedPersonnel: [1, 5],
    notes: [{ time: hrs(47), author: 'BRO. Ramirez', text: 'Incendio controlado en 10 minutos.' }],
    resources: { waterUsed: 1200, foamUsed: 50, equipmentUsed: ['Mangueras 1.5"', 'Extintor PQS'] },
    responseTime: 7
  }
]

// ------------------------------------------------------------
// Cola de despacho
// ------------------------------------------------------------
const dispatchQueue = [
  { id: 1, incidentId: 3, priority: 'alta', location: 'Plaza Comercial Norte, Local 45', type: 'emergencia_medica', receivedAt: min(5), status: 'asignado', caller: 'Guardia de seguridad', phone: '55-1234-5678' },
  { id: 2, incidentId: 2, priority: 'alta', location: 'Periferico Sur km 15.5', type: 'rescate', receivedAt: min(25), status: 'asignado', caller: 'Ciudadano', phone: '55-8765-4321' },
  { id: 3, incidentId: 5, priority: 'baja', location: 'Escuela Primaria Benito Juarez', type: 'servicio', receivedAt: min(45), status: 'asignado', caller: 'Director escolar', phone: '55-2468-1357' }
]

// ------------------------------------------------------------
// Combustible
// ------------------------------------------------------------
const fuelLogs = [
  { id: 1, unit: '37', date: days(1), liters: 85, cost: 2030.65, km: 49850, operator: 'Bro. Carlos Mendez' },
  { id: 2, unit: '67', date: days(2), liters: 180, cost: 4347.00, km: 180500, operator: 'Tte. Roberto Sanchez' },
  { id: 3, unit: '78', date: days(3), liters: 75, cost: 1791.75, km: 5200, operator: 'Bro. Pedro Ramirez' },
  { id: 4, unit: '66', date: days(4), liters: 165, cost: 3984.75, km: 175300, operator: 'Cap. Jorge Garcia' },
  { id: 5, unit: '37', date: days(7), liters: 90, cost: 2137.50, km: 49500, operator: 'Bro. Carlos Mendez' },
  { id: 6, unit: '28', date: days(5), liters: 70, cost: 1672.30, km: 62400, operator: 'Bro. Ana Lopez' }
]

// ------------------------------------------------------------
// Notificaciones
// ------------------------------------------------------------
const notifications = [
  { id: 1, type: 'mantenimiento', priority: 'alta', title: 'Mantenimiento Programado U-37', message: 'La unidad U-37 requiere servicio de 50,000 km. Kilometraje actual: 49,850 km.', relatedEntity: { type: 'vehicle', id: '37' }, actionUrl: '/type-vehicle/description-u/37', createdAt: min(30), readAt: null },
  { id: 2, type: 'certificacion', priority: 'critica', title: 'Certificacion por Vencer', message: 'La certificacion "Primeros Auxilios Avanzados" del Bombero Carlos Mendez vence en 7 dias.', relatedEntity: { type: 'personnel', id: '5' }, actionUrl: '/training', createdAt: hrs(2), readAt: null },
  { id: 3, type: 'guardia', priority: 'normal', title: 'Cambio de Guardia', message: 'El cambio de guardia A a guardia B sera en 4 horas (06:00 hrs).', relatedEntity: { type: 'shift', id: 'B' }, actionUrl: '/', createdAt: hrs(4), readAt: hrs(3) },
  { id: 4, type: 'inventario', priority: 'alta', title: 'Stock Bajo - Mangueras', message: 'El inventario de mangueras de 2.5" esta por debajo del minimo requerido (3 unidades restantes).', relatedEntity: { type: 'tool', id: 'mangueras' }, actionUrl: '/tools', createdAt: hrs(6), readAt: null },
  { id: 5, type: 'sistema', priority: 'baja', title: 'Actualizacion del Sistema', message: 'Nueva version de ITSIO disponible (v1.2.0). Nuevas funciones de despacho incluidas.', relatedEntity: { type: 'system', id: 'update' }, actionUrl: null, createdAt: days(1), readAt: hrs(12) },
  { id: 6, type: 'mantenimiento', priority: 'normal', title: 'Verificacion de Equipo U-67', message: 'Recordatorio: Realizar verificacion mensual de bomba en unidad U-67.', relatedEntity: { type: 'vehicle', id: '67' }, actionUrl: '/type-vehicle/description-u/67', createdAt: hrs(48), readAt: null },
  { id: 7, type: 'certificacion', priority: 'alta', title: 'Recertificacion Requerida', message: 'El Teniente Roberto Sanchez debe recertificarse en manejo de materiales peligrosos.', relatedEntity: { type: 'personnel', id: '2' }, actionUrl: '/training', createdAt: hrs(72), readAt: null },
  { id: 8, type: 'incidente', priority: 'baja', title: 'Reporte Pendiente', message: 'El incidente #1247 requiere completar el reporte final.', relatedEntity: { type: 'incident', id: '1247' }, actionUrl: '/incidents', createdAt: hrs(96), readAt: hrs(90) }
]

// ------------------------------------------------------------
// Helpers de agregacion
// ------------------------------------------------------------
function personnelWithCerts() {
  return personnel.map(p => {
    const certs = certifications.filter(c => c.personnelId === p.id)
    return {
      id: p.id, name: p.name, rank: p.rank, guard: p.guard, initials: p.initials,
      avatarColor: p.avatarColor, hoursTraining: p.hoursTraining,
      validCerts: certs.filter(c => c.status === 'active').length,
      totalCerts: certs.length,
      expiringSoon: certs.filter(c => c.status === 'expiring').length,
      expiredCerts: certs.filter(c => c.status === 'expired').length
    }
  })
}

// ------------------------------------------------------------
// Router con todos los endpoints (mismo contrato que el API real)
// ------------------------------------------------------------
export const mockRouter = express.Router()
const r = mockRouter

r.get('/health', (req, res) => res.json({ ok: true, service: 'itsio-api', mode: 'mock' }))

// Vehiculos
r.get('/vehicle-types', (req, res) => {
  res.json(vehicleTypes.map(vt => {
    const list = vehicles.filter(v => v.type === vt.type)
    return {
      type: vt.type,
      img: vt.img,
      operativeVehicles: list.filter(v => v.status === 'operativa').length,
      VehiclesWorkshop: list.filter(v => v.status === 'taller' || v.status === 'in-operativa').length
    }
  }))
})

r.get('/vehicles', (req, res) => {
  const { type, status } = req.query
  let list = vehicles
  if (type) list = list.filter(v => v.type === type)
  if (status && status !== 'todas') list = list.filter(v => v.status === status)
  res.json(list.map(({ numberUnit, type, img, status, model, carBrand }) => ({ numberUnit, type, img, status, model, carBrand })))
})

r.get('/vehicles/:numberUnit', (req, res) => {
  const v = vehicles.find(v => v.numberUnit === req.params.numberUnit)
  if (!v) return res.status(404).json({ error: 'Vehiculo no encontrado' })
  res.json(v)
})

r.patch('/vehicles/:numberUnit', (req, res) => {
  const v = vehicles.find(v => v.numberUnit === req.params.numberUnit)
  if (!v) return res.status(404).json({ error: 'Vehiculo no encontrado' })
  if (req.body.status != null) v.status = req.body.status
  if (req.body.kilometraje != null) v.kilometraje = req.body.kilometraje
  res.json(v)
})

// Personal
r.get('/personnel', (req, res) => res.json(personnelWithCerts()))

r.get('/personnel/skill-matrix', (req, res) => {
  res.json(personnel.map(p => ({
    id: p.id, name: p.name, rank: p.rank, hoursTraining: p.hoursTraining,
    certifications: certifications.filter(c => c.personnelId === p.id).length,
    skills: p.skills
  })))
})

r.get('/personnel/:id/certifications', (req, res) => {
  const id = Number(req.params.id)
  res.json(certifications.filter(c => c.personnelId === id).map(c => ({
    ...c, personnelId: c.personnelId, daysRemaining: daysBetween(c.expiryDate)
  })))
})

// Certificaciones (global)
r.get('/certifications', (req, res) => {
  res.json(certifications.map(c => ({
    id: c.id, name: c.name, category: c.category, personnelId: c.personnelId,
    personnelName: (personnel.find(p => p.id === c.personnelId) || {}).name,
    issuedDate: c.issuedDate, expirationDate: c.expiryDate, status: c.status,
    issuingAuthority: c.institution
  })))
})

// Cursos
r.get('/courses', (req, res) => res.json(courses))
r.post('/courses/:id/enroll', (req, res) => {
  const course = courses.find(c => c.id === Number(req.params.id))
  if (course && req.body.personnelId && !course.attendees.includes(req.body.personnelId)) {
    course.attendees.push(req.body.personnelId)
  }
  res.json({ ok: true })
})

// Incidentes
r.get('/incidents', (req, res) => res.json(incidents))
r.get('/incidents/active', (req, res) => res.json(incidents.filter(i => i.status !== 'cerrado')))
r.get('/incidents/:id', (req, res) => {
  const inc = incidents.find(i => i.id === Number(req.params.id))
  if (!inc) return res.status(404).json({ error: 'Incidente no encontrado' })
  res.json(inc)
})
r.post('/incidents', (req, res) => {
  const b = req.body
  const id = Math.max(0, ...incidents.map(i => i.id)) + 1
  incidents.unshift({
    id, type: b.type, subtype: b.subtype, priority: b.priority, status: b.status || 'activo',
    location: { address: b.address, lat: b.lat, lng: b.lng },
    reportedAt: new Date().toISOString(), dispatchedAt: null, arrivedAt: null, closedAt: null,
    description: b.description, assignedUnits: [], assignedPersonnel: [], notes: [],
    resources: { waterUsed: 0, foamUsed: 0, equipmentUsed: [] }, responseTime: null
  })
  res.status(201).json({ id })
})
r.post('/incidents/:id/notes', (req, res) => {
  const inc = incidents.find(i => i.id === Number(req.params.id))
  if (!inc) return res.status(404).json({ error: 'Incidente no encontrado' })
  const note = { time: new Date().toISOString(), author: req.body.author, text: req.body.text }
  inc.notes.push(note)
  res.status(201).json(note)
})
r.patch('/incidents/:id', (req, res) => {
  const inc = incidents.find(i => i.id === Number(req.params.id))
  if (!inc) return res.status(404).json({ error: 'Incidente no encontrado' })
  if (req.body.status != null) {
    inc.status = req.body.status
    if (req.body.status === 'cerrado') inc.closedAt = new Date().toISOString()
  }
  res.json({ id: inc.id, status: inc.status })
})

// Despacho
r.get('/dispatch/queue', (req, res) => res.json(dispatchQueue))
r.get('/dispatch/units', (req, res) => {
  res.json(vehicles.map(v => ({
    unitId: 'U-' + v.numberUnit,
    type: v.type,
    status: v.status === 'operativa' ? 'disponible' : 'fuera_servicio',
    number_unit: v.numberUnit
  })))
})
r.post('/dispatch/queue', (req, res) => {
  const b = req.body
  const id = Math.max(0, ...dispatchQueue.map(d => d.id)) + 1
  dispatchQueue.push({ id, incidentId: b.incidentId ?? null, priority: b.priority, location: b.location, type: b.type, receivedAt: new Date().toISOString(), status: b.status || 'pendiente', caller: b.caller, phone: b.phone })
  res.status(201).json({ id })
})

// Combustible
r.get('/fuel-logs', (req, res) => res.json(fuelLogs))
r.post('/fuel-logs', (req, res) => {
  const b = req.body
  const id = Math.max(0, ...fuelLogs.map(f => f.id)) + 1
  fuelLogs.unshift({ id, unit: b.unit, date: new Date().toISOString(), liters: b.liters, cost: b.cost, km: b.km, operator: b.operator })
  res.status(201).json({ id })
})

// Resumen de flota
r.get('/fleet/summary', (req, res) => {
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const monthLogs = fuelLogs.filter(f => new Date(f.date) >= monthStart)
  res.json({
    totalVehicles: vehicles.length,
    operative: vehicles.filter(v => v.status === 'operativa').length,
    inWorkshop: vehicles.filter(v => v.status !== 'operativa').length,
    totalFuelThisMonth: monthLogs.reduce((s, f) => s + f.liters, 0),
    totalCostThisMonth: monthLogs.reduce((s, f) => s + f.cost, 0)
  })
})

// Notificaciones
r.get('/notifications', (req, res) => res.json(notifications))
r.get('/notifications/unread-count', (req, res) => res.json({ count: notifications.filter(n => !n.readAt).length }))
r.patch('/notifications/:id/read', (req, res) => {
  const n = notifications.find(n => n.id === Number(req.params.id))
  if (n && !n.readAt) n.readAt = new Date().toISOString()
  res.json({ ok: true })
})
r.post('/notifications/read-all', (req, res) => {
  notifications.forEach(n => { if (!n.readAt) n.readAt = new Date().toISOString() })
  res.json({ ok: true })
})
