import { api } from '@/utils/api'

// Lista de personal con estadisticas de certificaciones
export async function getTrainingData() {
  const personnel = await api.get('/personnel')
  return {
    personnel: personnel.map(p => ({
      id: p.id,
      name: p.name,
      rank: p.rank,
      guard: p.guard,
      initials: p.initials,
      avatarColor: p.avatarColor,
      validCerts: p.validCerts,
      totalCerts: p.totalCerts,
      expiringSoon: p.expiringSoon,
      expiredCerts: p.expiredCerts
    }))
  }
}

// Certificaciones de una persona (calcula progreso a partir de las fechas)
export async function getPersonnelCertifications(personnelId) {
  const certs = await api.get(`/personnel/${personnelId}/certifications`)
  return certs.map(c => ({
    ...c,
    progressPercent: computeProgress(c.issuedDate, c.expiryDate),
    daysRemaining: Number(c.daysRemaining) || 0
  }))
}

// Proximos cursos (formatea fecha en dia / mes)
export async function getUpcomingCourses() {
  const courses = await api.get('/courses')
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
  return courses
    .filter(c => c.status === 'programado')
    .map(c => {
      const d = new Date(c.scheduledDate)
      return {
        id: c.id,
        name: c.title,
        instructor: c.instructor,
        day: String(d.getDate()).padStart(2, '0'),
        month: months[d.getMonth()],
        duration: `${c.duration} hrs`,
        enrolled: (c.attendees || []).length,
        capacity: c.maxCapacity
      }
    })
}

// Certificaciones (vista global)
export async function getCertifications() {
  const certs = await api.get('/certifications')
  return certs.map(c => ({
    ...c,
    issuedDate: c.issuedDate ? new Date(c.issuedDate) : null,
    expirationDate: c.expirationDate ? new Date(c.expirationDate) : null
  }))
}

// Cursos completos
export async function getCourses() {
  const courses = await api.get('/courses')
  return courses.map(c => ({
    id: c.id,
    title: c.title,
    type: c.type,
    scheduledDate: c.scheduledDate ? new Date(c.scheduledDate) : null,
    duration: c.duration,
    instructor: c.instructor,
    attendees: c.attendees || [],
    maxCapacity: c.maxCapacity,
    status: c.status,
    location: c.location
  }))
}

// Matriz de habilidades
export async function getPersonnelSkillMatrix() {
  return api.get('/personnel/skill-matrix')
}

// Inscribir personal a un curso
export async function enrollInCourse(courseId, personnelId) {
  return api.post(`/courses/${courseId}/enroll`, { personnelId })
}

function computeProgress(issued, expiry) {
  if (!issued || !expiry) return 0
  const start = new Date(issued).getTime()
  const end = new Date(expiry).getTime()
  const now = Date.now()
  if (now <= start) return 0
  if (now >= end) return 100
  return Math.round(((now - start) / (end - start)) * 100)
}

// ---- Helpers (sin cambios) ----
export function getCategoryLabel(category) {
  const labels = {
    medica: 'Médica',
    combate_incendio: 'Combate de Incendios',
    rescate: 'Rescate',
    hazmat: 'Mat. Peligrosos'
  }
  return labels[category] || category
}

export function getCertStatusClass(status) {
  const classes = {
    vigente: 'cert-vigente',
    por_vencer: 'cert-por-vencer',
    vencida: 'cert-vencida'
  }
  return classes[status] || ''
}

export function getCourseTypeLabel(type) {
  const labels = {
    curso: 'Curso',
    practica: 'Práctica',
    simulacro: 'Simulacro'
  }
  return labels[type] || type
}
