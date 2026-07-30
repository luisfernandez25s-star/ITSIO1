// Analytics Dashboard data
export async function getKPIs() {
  return {
    responseTime: { 
      current: 4.2, 
      target: 5, 
      unit: 'min',
      trend: -0.3,
      status: 'bueno'
    },
    incidentsToday: 12,
    incidentsMonth: 156,
    incidentsLastMonth: 142,
    fleetAvailability: 73,
    fleetAvailabilityTarget: 80,
    personnelOnDuty: 18,
    totalPersonnel: 45,
    avgIncidentDuration: 45,
    avgIncidentDurationTarget: 40,
    waterUsedMonth: 125000,
    rescuesMonth: 28,
    medicalAssists: 45
  }
}

export async function getResponseTimeHistory() {
  return [
    { date: 'Lun', avgTime: 4.5, incidents: 18 },
    { date: 'Mar', avgTime: 4.2, incidents: 22 },
    { date: 'Mié', avgTime: 4.8, incidents: 15 },
    { date: 'Jue', avgTime: 3.9, incidents: 25 },
    { date: 'Vie', avgTime: 4.1, incidents: 28 },
    { date: 'Sáb', avgTime: 4.6, incidents: 32 },
    { date: 'Dom', avgTime: 4.3, incidents: 16 }
  ]
}

export async function getIncidentsByType() {
  return [
    { type: 'Incendio', count: 45, percentage: 29, color: 'var(--accent-red)' },
    { type: 'Rescate', count: 32, percentage: 21, color: 'var(--accent-orange)' },
    { type: 'Emergencia Médica', count: 48, percentage: 31, color: 'var(--accent-blue)' },
    { type: 'HAZMAT', count: 8, percentage: 5, color: 'var(--accent-amber)' },
    { type: 'Servicios', count: 23, percentage: 14, color: 'var(--accent-green)' }
  ]
}

export async function getMonthlyIncidents() {
  return [
    { month: 'Oct', incendios: 42, rescates: 28, medicas: 45, hazmat: 6, servicios: 20 },
    { month: 'Nov', incendios: 38, rescates: 31, medicas: 42, hazmat: 5, servicios: 22 },
    { month: 'Dic', incendios: 52, rescates: 35, medicas: 50, hazmat: 8, servicios: 25 },
    { month: 'Ene', incendios: 45, rescates: 32, medicas: 48, hazmat: 8, servicios: 23 },
    { month: 'Feb', incendios: 40, rescates: 29, medicas: 44, hazmat: 7, servicios: 21 },
    { month: 'Mar', incendios: 48, rescates: 34, medicas: 52, hazmat: 9, servicios: 26 }
  ]
}

export async function getFleetStatusSummary() {
  return [
    { status: 'Operativa', count: 22, percentage: 73 },
    { status: 'En Taller', count: 5, percentage: 17 },
    { status: 'Mantenimiento', count: 3, percentage: 10 }
  ]
}

export async function getPersonnelByShift() {
  return [
    { shift: 'Guardia A', onDuty: 12, total: 12, status: 'completa' },
    { shift: 'Guardia B', onDuty: 11, total: 12, status: 'incompleta' },
    { shift: 'Guardia C', onDuty: 10, total: 11, status: 'incompleta' },
    { shift: 'Guardia D', onDuty: 10, total: 10, status: 'completa' }
  ]
}

export async function getTopIncidentLocations() {
  return [
    { location: 'Centro Histórico', incidents: 28, percentage: 18 },
    { location: 'Zona Industrial Norte', incidents: 22, percentage: 14 },
    { location: 'Col. Roma', incidents: 18, percentage: 12 },
    { location: 'Periférico Sur', incidents: 15, percentage: 10 },
    { location: 'Zona Comercial', incidents: 14, percentage: 9 }
  ]
}

export async function getHourlyDistribution() {
  return [
    { hour: '00-04', incidents: 8 },
    { hour: '04-08', incidents: 12 },
    { hour: '08-12', incidents: 28 },
    { hour: '12-16', incidents: 35 },
    { hour: '16-20', incidents: 42 },
    { hour: '20-24', incidents: 31 }
  ]
}

export async function getPerformanceMetrics() {
  return {
    avgResponseTime: 4.2,
    responseTimeTarget: 5,
    avgOnSceneTime: 32,
    onSceneTimeTarget: 30,
    successRate: 98.5,
    citizenSatisfaction: 4.7,
    equipmentReadiness: 94
  }
}
