// =============================================================
// usersMock.js  ·  SOLO FRONTEND (mock)
// -------------------------------------------------------------
// Simula el directorio de empleados "dados de alta por el admin",
// sus rangos (roles) y los permisos de cada rango.
//
// El compañero de backend debe reemplazar EMPLOYEES / GOOGLE_ACCOUNTS
// por consultas reales a la base de datos y validar los permisos en
// el servidor. Las firmas de las funciones se pueden mantener.
// =============================================================

// ---- Rangos / Roles ----
// level: sirve solo de referencia jerárquica.
export const ROLES = {
  admin:      { key: 'admin',      label: 'Administrador',          level: 4 },
  comandante: { key: 'comandante', label: 'Comandante de Estación', level: 3 },
  oficial:    { key: 'oficial',    label: 'Oficial de Guardia',     level: 2 },
  bombero:    { key: 'bombero',    label: 'Bombero',                level: 1 },
}

// ---- Permisos por rango ----
// Cada valor es una "route key" usada en la navegación (SizeBar/MobileNav)
// y en meta.perm de las rutas. 'wellcome' = pantalla de inicio.
export const ROLE_ROUTES = {
  admin: [
    'wellcome', 'analytics', 'data-studio', 'dispatch', 'incidents', 'stateforce',
    'typeToVehicles', 'fleet-analytics', 'tools', 'training', 'reports', 'efficiency',
  ],
  comandante: [
    'wellcome', 'analytics', 'data-studio', 'dispatch', 'incidents', 'stateforce',
    'typeToVehicles', 'fleet-analytics', 'tools', 'training', 'reports', 'efficiency',
  ],
  oficial: [
    'wellcome', 'dispatch', 'incidents', 'stateforce',
    'typeToVehicles', 'tools', 'training',
  ],
  bombero: [
    'wellcome', 'incidents', 'stateforce', 'typeToVehicles', 'tools',
  ],
}

// ---- Directorio de empleados (dados de alta por el admin) ----
// Backend real: viene de la base de datos. La contraseña NUNCA se
// guarda en texto plano en producción.
export const EMPLOYEES = [
  {
    employeeId: '24-01', password: 'Admin#2024!',
    name: 'Cmdt. Alejandro Ríos', role: 'admin',
    email: 'a.rios@itsio.gob.mx', google: 'a.rios@gmail.com',
    station: 'Estación Central 01', shift: 'Guardia A',
  },
  {
    employeeId: '24-02', password: 'Coma#2024x!',
    name: 'Cap. Beatriz Núñez', role: 'comandante',
    email: 'b.nunez@itsio.gob.mx', google: 'b.nunez@gmail.com',
    station: 'Estación Central 01', shift: 'Guardia B',
  },
  {
    employeeId: '24-03', password: 'Ofic#2024y!',
    name: 'Tte. Carlos Mena', role: 'oficial',
    email: 'c.mena@itsio.gob.mx', google: 'c.mena@gmail.com',
    station: 'Estación Norte 03', shift: 'Guardia C',
  },
  {
    employeeId: '24-04', password: 'Bomb#2024z!',
    name: 'Bombero David Soto', role: 'bombero',
    email: 'd.soto@itsio.gob.mx', google: 'd.soto@gmail.com',
    station: 'Estación Sur 02', shift: 'Guardia A',
  },
]

// ---- Cuentas de Google que aparecen en el selector ----
// Algunas NO tienen permiso (no están dadas de alta por el admin).
export const GOOGLE_ACCOUNTS = [
  { email: 'a.rios@gmail.com', name: 'Alejandro Ríos', avatar: 'AR' },
  { email: 'c.mena@gmail.com', name: 'Carlos Mena', avatar: 'CM' },
  { email: 'd.soto@gmail.com', name: 'David Soto', avatar: 'DS' },
  { email: 'visitante@gmail.com', name: 'Cuenta Personal', avatar: 'CP' }, // sin permiso
]

// ---- Búsquedas ----
export function findByEmployeeId(id) {
  const clean = String(id || '').trim().toLowerCase()
  return EMPLOYEES.find(e => e.employeeId.toLowerCase() === clean) || null
}

export function findByGoogle(email) {
  const clean = String(email || '').trim().toLowerCase()
  return EMPLOYEES.find(e => e.google.toLowerCase() === clean) || null
}

// ---- Permisos ----
export function canAccess(roleKey, routeKey) {
  const allowed = ROLE_ROUTES[roleKey] || ROLE_ROUTES.bombero
  return allowed.includes(routeKey)
}

// ---- Sesión (solo frontend) ----
// Construye el objeto de sesión a partir de un empleado y lo guarda.
export function loginUser(emp, via = 'password') {
  const roleKey = emp.role
  const session = {
    employeeId: emp.employeeId,
    name: emp.name,
    roleKey,
    role: (ROLES[roleKey] || ROLES.bombero).label,
    email: emp.email,
    station: emp.station,
    shift: emp.shift,
    via, // 'password' | 'google'
  }
  localStorage.setItem('itsio-auth', 'true')
  localStorage.setItem('itsio-user', JSON.stringify(session))
  return session
}

// Devuelve la sesión activa (o null).
export function getSession() {
  try {
    const raw = localStorage.getItem('itsio-user')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}
