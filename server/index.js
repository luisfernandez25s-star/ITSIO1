import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { query, pool } from './db.js'
import { mockRouter } from './mock.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.API_PORT || 3001

// Cuando no hay base de datos disponible, servimos datos en memoria (mock)
// para que la app sea totalmente funcional en la vista previa.
// Este middleware se registra ANTES que las rutas de DB, por lo que tiene
// prioridad cuando useMock = true.
// Por defecto usamos mock si no hay DATABASE_URL (caso vista previa).
// detectDatabase() lo ajusta tras probar la conexion real al iniciar.
let useMock = !process.env.DATABASE_URL
app.use('/api', (req, res, next) => {
  if (useMock) return mockRouter(req, res, next)
  next()
})

// Pequeno helper para envolver handlers async y capturar errores
const wrap = (fn) => (req, res) => fn(req, res).catch((err) => {
  console.error('[ITSIO API] Error:', err.message)
  res.status(500).json({ error: err.message })
})

// ============================================================
// HEALTH
// ============================================================
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'itsio-api' }))

// ============================================================
// VEHICULOS / FLOTA
// ============================================================

// Tipos de vehiculo con conteo operativas / taller
app.get('/api/vehicle-types', wrap(async (req, res) => {
  const rows = await query(`
    SELECT vt.type, vt.img,
      COUNT(v.*) FILTER (WHERE v.status = 'operativa')                   AS "operativeVehicles",
      COUNT(v.*) FILTER (WHERE v.status IN ('taller','in-operativa'))    AS "VehiclesWorkshop"
    FROM vehicle_types vt
    LEFT JOIN vehicles v ON v.type = vt.type
    GROUP BY vt.type, vt.img, vt.id
    ORDER BY vt.id
  `)
  res.json(rows.map(r => ({
    type: r.type,
    img: r.img,
    operativeVehicles: Number(r.operativeVehicles),
    VehiclesWorkshop: Number(r.VehiclesWorkshop)
  })))
}))

// Vehiculos de un tipo, opcionalmente filtrados por status
// /api/vehicles?type=Rapida&status=operativa  (status "todas" => todos)
app.get('/api/vehicles', wrap(async (req, res) => {
  const { type, status } = req.query
  const params = []
  const where = []
  if (type) { params.push(type); where.push(`type = $${params.length}`) }
  if (status && status !== 'todas') { params.push(status); where.push(`status = $${params.length}`) }
  const sql = `
    SELECT number_unit AS "numberUnit", type, img, status, model, car_brand AS "carBrand"
    FROM vehicles
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY number_unit
  `
  res.json(await query(sql, params))
}))

// Detalle de un vehiculo por numero de unidad
app.get('/api/vehicles/:numberUnit', wrap(async (req, res) => {
  const rows = await query(`
    SELECT number_unit AS "numberUnit", type, img, status, model,
           car_brand AS "carBrand", placas, kilometraje
    FROM vehicles WHERE number_unit = $1
  `, [req.params.numberUnit])
  if (!rows.length) return res.status(404).json({ error: 'Vehiculo no encontrado' })
  res.json(rows[0])
}))

// Actualizar status / kilometraje de un vehiculo
app.patch('/api/vehicles/:numberUnit', wrap(async (req, res) => {
  const { status, kilometraje } = req.body
  const rows = await query(`
    UPDATE vehicles
    SET status = COALESCE($2, status),
        kilometraje = COALESCE($3, kilometraje)
    WHERE number_unit = $1
    RETURNING number_unit AS "numberUnit", type, status, kilometraje
  `, [req.params.numberUnit, status ?? null, kilometraje ?? null])
  if (!rows.length) return res.status(404).json({ error: 'Vehiculo no encontrado' })
  res.json(rows[0])
}))

// ============================================================
// PERSONAL / FUERZA DE ESTADO
// ============================================================
app.get('/api/personnel', wrap(async (req, res) => {
  const rows = await query(`
    SELECT p.id, p.name, p.rank, p.guard, p.initials,
           p.avatar_color AS "avatarColor", p.hours_training AS "hoursTraining",
           COUNT(c.*) FILTER (WHERE c.status = 'active')   AS "validCerts",
           COUNT(c.*)                                       AS "totalCerts",
           COUNT(c.*) FILTER (WHERE c.status = 'expiring') AS "expiringSoon",
           COUNT(c.*) FILTER (WHERE c.status = 'expired')  AS "expiredCerts"
    FROM personnel p
    LEFT JOIN certifications c ON c.personnel_id = p.id
    GROUP BY p.id
    ORDER BY p.id
  `)
  res.json(rows.map(r => ({
    ...r,
    validCerts: Number(r.validCerts),
    totalCerts: Number(r.totalCerts),
    expiringSoon: Number(r.expiringSoon),
    expiredCerts: Number(r.expiredCerts)
  })))
}))

// Matriz de habilidades
app.get('/api/personnel/skill-matrix', wrap(async (req, res) => {
  const rows = await query(`
    SELECT p.id, p.name, p.rank, p.hours_training AS "hoursTraining",
           p.skill_combate_incendio, p.skill_rescate, p.skill_hazmat,
           p.skill_medica, p.skill_conduccion,
           COUNT(c.*) AS certifications
    FROM personnel p
    LEFT JOIN certifications c ON c.personnel_id = p.id
    GROUP BY p.id
    ORDER BY p.id
  `)
  res.json(rows.map(r => ({
    id: r.id,
    name: r.name,
    rank: r.rank,
    hoursTraining: r.hoursTraining,
    certifications: Number(r.certifications),
    skills: {
      combate_incendio: r.skill_combate_incendio,
      rescate: r.skill_rescate,
      hazmat: r.skill_hazmat,
      medica: r.skill_medica,
      conduccion: r.skill_conduccion
    }
  })))
}))

// Certificaciones de una persona
app.get('/api/personnel/:id/certifications', wrap(async (req, res) => {
  const rows = await query(`
    SELECT id, personnel_id AS "personnelId", name, category, status,
           to_char(issued_date,'YYYY-MM-DD') AS "issuedDate",
           to_char(expiry_date,'YYYY-MM-DD') AS "expiryDate",
           institution,
           GREATEST(0, (expiry_date - CURRENT_DATE)) AS "daysRemaining"
    FROM certifications WHERE personnel_id = $1
    ORDER BY id
  `, [req.params.id])
  res.json(rows)
}))

// ============================================================
// CERTIFICACIONES (vista global)
// ============================================================
app.get('/api/certifications', wrap(async (req, res) => {
  const rows = await query(`
    SELECT c.id, c.name, c.category, c.personnel_id AS "personnelId",
           p.name AS "personnelName",
           c.issued_date AS "issuedDate", c.expiry_date AS "expirationDate",
           c.status, c.institution AS "issuingAuthority"
    FROM certifications c
    JOIN personnel p ON p.id = c.personnel_id
    ORDER BY c.id
  `)
  res.json(rows)
}))

// ============================================================
// CURSOS / CAPACITACION
// ============================================================
app.get('/api/courses', wrap(async (req, res) => {
  const rows = await query(`
    SELECT c.id, c.title, c.type, c.scheduled_date AS "scheduledDate",
           c.duration_hours AS duration, c.instructor,
           c.max_capacity AS "maxCapacity", c.status, c.location,
           COALESCE(array_agg(ca.personnel_id) FILTER (WHERE ca.personnel_id IS NOT NULL), '{}') AS attendees
    FROM courses c
    LEFT JOIN course_attendees ca ON ca.course_id = c.id
    GROUP BY c.id
    ORDER BY c.scheduled_date
  `)
  res.json(rows)
}))

// Inscribir personal a un curso
app.post('/api/courses/:id/enroll', wrap(async (req, res) => {
  const { personnelId } = req.body
  await query(`
    INSERT INTO course_attendees (course_id, personnel_id)
    VALUES ($1, $2) ON CONFLICT DO NOTHING
  `, [req.params.id, personnelId])
  res.json({ ok: true })
}))

// ============================================================
// INCIDENTES
// ============================================================
async function buildIncidents(whereClause = '', params = []) {
  const incidents = await query(`
    SELECT i.id, i.type, i.subtype, i.priority, i.status,
           i.address, i.lat, i.lng,
           i.reported_at AS "reportedAt", i.dispatched_at AS "dispatchedAt",
           i.arrived_at AS "arrivedAt", i.closed_at AS "closedAt",
           i.description, i.water_used AS "waterUsed", i.foam_used AS "foamUsed",
           i.equipment_used AS "equipmentUsed", i.response_time AS "responseTime"
    FROM incidents i
    ${whereClause}
    ORDER BY i.reported_at DESC
  `, params)

  if (!incidents.length) return []

  const ids = incidents.map(i => i.id)
  const units = await query(`SELECT incident_id, unit_label FROM incident_units WHERE incident_id = ANY($1)`, [ids])
  const people = await query(`SELECT incident_id, personnel_id FROM incident_personnel WHERE incident_id = ANY($1)`, [ids])
  const notes = await query(`
    SELECT incident_id, note_time AS time, author, text
    FROM incident_notes WHERE incident_id = ANY($1) ORDER BY note_time
  `, [ids])

  return incidents.map(inc => ({
    ...inc,
    location: { address: inc.address, lat: inc.lat, lng: inc.lng },
    assignedUnits: units.filter(u => u.incident_id === inc.id).map(u => u.unit_label),
    assignedPersonnel: people.filter(p => p.incident_id === inc.id).map(p => p.personnel_id),
    notes: notes.filter(n => n.incident_id === inc.id).map(n => ({ time: n.time, author: n.author, text: n.text })),
    resources: { waterUsed: inc.waterUsed, foamUsed: inc.foamUsed, equipmentUsed: inc.equipmentUsed || [] }
  }))
}

app.get('/api/incidents', wrap(async (req, res) => {
  res.json(await buildIncidents())
}))

app.get('/api/incidents/active', wrap(async (req, res) => {
  res.json(await buildIncidents(`WHERE i.status <> 'cerrado'`))
}))

app.get('/api/incidents/:id', wrap(async (req, res) => {
  const rows = await buildIncidents('WHERE i.id = $1', [req.params.id])
  if (!rows.length) return res.status(404).json({ error: 'Incidente no encontrado' })
  res.json(rows[0])
}))

// Crear incidente
app.post('/api/incidents', wrap(async (req, res) => {
  const b = req.body
  const rows = await query(`
    INSERT INTO incidents (type, subtype, priority, status, address, lat, lng, description)
    VALUES ($1,$2,$3,COALESCE($4,'activo'),$5,$6,$7,$8)
    RETURNING id
  `, [b.type, b.subtype, b.priority, b.status, b.address, b.lat, b.lng, b.description])
  res.status(201).json({ id: rows[0].id })
}))

// Agregar nota a un incidente
app.post('/api/incidents/:id/notes', wrap(async (req, res) => {
  const { author, text } = req.body
  const rows = await query(`
    INSERT INTO incident_notes (incident_id, author, text)
    VALUES ($1, $2, $3) RETURNING id, note_time AS time, author, text
  `, [req.params.id, author, text])
  res.status(201).json(rows[0])
}))

// Cambiar estado de un incidente
app.patch('/api/incidents/:id', wrap(async (req, res) => {
  const { status } = req.body
  const rows = await query(`
    UPDATE incidents
    SET status = COALESCE($2, status),
        closed_at = CASE WHEN $2 = 'cerrado' THEN now() ELSE closed_at END
    WHERE id = $1 RETURNING id, status
  `, [req.params.id, status ?? null])
  if (!rows.length) return res.status(404).json({ error: 'Incidente no encontrado' })
  res.json(rows[0])
}))

// ============================================================
// DESPACHO
// ============================================================
app.get('/api/dispatch/queue', wrap(async (req, res) => {
  res.json(await query(`
    SELECT id, incident_id AS "incidentId", priority, location, type,
           received_at AS "receivedAt", status, caller, phone
    FROM dispatch_queue ORDER BY received_at
  `))
}))

// Estado de las unidades (derivado de la flota + incidentes)
app.get('/api/dispatch/units', wrap(async (req, res) => {
  const rows = await query(`
    SELECT 'U-' || v.number_unit AS "unitId", v.type,
           CASE v.status
             WHEN 'operativa' THEN 'disponible'
             WHEN 'taller' THEN 'fuera_servicio'
             ELSE 'fuera_servicio' END AS status,
           v.number_unit
    FROM vehicles v ORDER BY v.number_unit
  `)
  res.json(rows)
}))

// Crear entrada en la cola de despacho
app.post('/api/dispatch/queue', wrap(async (req, res) => {
  const b = req.body
  const rows = await query(`
    INSERT INTO dispatch_queue (incident_id, priority, location, type, status, caller, phone)
    VALUES ($1,$2,$3,$4,COALESCE($5,'pendiente'),$6,$7)
    RETURNING id
  `, [b.incidentId ?? null, b.priority, b.location, b.type, b.status, b.caller, b.phone])
  res.status(201).json({ id: rows[0].id })
}))

// ============================================================
// COMBUSTIBLE / FLEET ANALYTICS
// ============================================================
app.get('/api/fuel-logs', wrap(async (req, res) => {
  res.json(await query(`
    SELECT id, unit, log_date AS date, liters, cost, km, operator
    FROM fuel_logs ORDER BY log_date DESC
  `))
}))

app.post('/api/fuel-logs', wrap(async (req, res) => {
  const b = req.body
  const rows = await query(`
    INSERT INTO fuel_logs (unit, liters, cost, km, operator)
    VALUES ($1,$2,$3,$4,$5) RETURNING id
  `, [b.unit, b.liters, b.cost, b.km, b.operator])
  res.status(201).json({ id: rows[0].id })
}))

// Resumen de flota / combustible
app.get('/api/fleet/summary', wrap(async (req, res) => {
  const [veh] = await query(`
    SELECT COUNT(*) AS total,
           COUNT(*) FILTER (WHERE status='operativa') AS operative,
           COUNT(*) FILTER (WHERE status<>'operativa') AS in_workshop
    FROM vehicles
  `)
  const [fuel] = await query(`
    SELECT COALESCE(SUM(liters),0) AS liters, COALESCE(SUM(cost),0) AS cost
    FROM fuel_logs WHERE log_date >= date_trunc('month', now())
  `)
  res.json({
    totalVehicles: Number(veh.total),
    operative: Number(veh.operative),
    inWorkshop: Number(veh.in_workshop),
    totalFuelThisMonth: Number(fuel.liters),
    totalCostThisMonth: Number(fuel.cost)
  })
}))

// ============================================================
// NOTIFICACIONES
// ============================================================
app.get('/api/notifications', wrap(async (req, res) => {
  res.json(await query(`
    SELECT id, type, priority, title, message,
           related_entity_type, related_entity_id,
           action_url AS "actionUrl",
           created_at AS "createdAt", read_at AS "readAt"
    FROM notifications ORDER BY created_at DESC
  `).then(rows => rows.map(r => ({
    id: r.id, type: r.type, priority: r.priority, title: r.title, message: r.message,
    relatedEntity: { type: r.related_entity_type, id: r.related_entity_id },
    actionUrl: r.actionUrl, createdAt: r.createdAt, readAt: r.readAt
  }))))
}))

app.get('/api/notifications/unread-count', wrap(async (req, res) => {
  const [row] = await query(`SELECT COUNT(*) AS count FROM notifications WHERE read_at IS NULL`)
  res.json({ count: Number(row.count) })
}))

// Marcar una notificacion como leida
app.patch('/api/notifications/:id/read', wrap(async (req, res) => {
  await query(`UPDATE notifications SET read_at = now() WHERE id = $1 AND read_at IS NULL`, [req.params.id])
  res.json({ ok: true })
}))

// Marcar todas como leidas
app.post('/api/notifications/read-all', wrap(async (req, res) => {
  await query(`UPDATE notifications SET read_at = now() WHERE read_at IS NULL`)
  res.json({ ok: true })
}))

// ============================================================
// Verifica si hay una base de datos disponible. Si no, activa el
// modo mock (datos en memoria) para que la app funcione igualmente.
async function detectDatabase() {
  if (!process.env.DATABASE_URL) {
    useMock = true
    console.warn('[ITSIO API] DATABASE_URL no definida -> usando datos en memoria (modo mock).')
    return
  }
  try {
    await pool.query('SELECT 1')
    useMock = false
    console.log('[ITSIO API] Conectado a PostgreSQL.')
  } catch (err) {
    useMock = true
    console.warn(`[ITSIO API] No se pudo conectar a la base de datos (${err.message}) -> usando datos en memoria (modo mock).`)
  }
}

app.listen(PORT, async () => {
  await detectDatabase()
  console.log(`[ITSIO API] Servidor escuchando en http://localhost:${PORT}`)
})
