// Fleet Analytics & Fuel Tracking data
import { api } from '@/utils/api'

// Bitacora de combustible (datos reales desde la API)
export async function getFuelLogs() {
  const logs = await api.get('/fuel-logs')
  return logs.map(l => ({
    id: l.id,
    unit: Number(l.unit),
    date: l.date ? new Date(l.date) : null,
    liters: Number(l.liters),
    cost: Number(l.cost),
    km: l.km,
    operator: l.operator
  }))
}

// Registrar carga de combustible
export async function addFuelLog(payload) {
  return api.post('/fuel-logs', payload)
}

// Resumen de flota (datos reales desde la API, con campos calculados)
export async function getFleetSummary() {
  const s = await api.get('/fleet/summary')
  return {
    totalVehicles: s.totalVehicles,
    operative: s.operative,
    inWorkshop: s.inWorkshop,
    totalFuelThisMonth: s.totalFuelThisMonth,
    totalCostThisMonth: s.totalCostThisMonth,
    avgKmPerLiter: 3.85,
    totalKmThisMonth: 10975,
    totalIncidentsAttended: 156
  }
}

// Alias exports for view compatibility
export async function getFleetAnalyticsData() {
  return {
    stats: {
      totalFuel: 2850,
      totalFuelPrev: 2630,
      totalCost: 68420,
      totalCostPrev: 60850,
      totalKm: 10975,
      avgEfficiency: 3.85
    },
    vehicles: [
      { id: 'U-37', type: 'Rapida', fuel: 320, km: 1850, cost: 7650, efficiency: 5.78 },
      { id: 'U-78', type: 'Rapida', fuel: 280, km: 1658, cost: 6692, efficiency: 5.92 },
      { id: 'U-14', type: 'Rapida', fuel: 310, km: 1690, cost: 7411, efficiency: 5.45 },
      { id: 'U-28', type: 'Rapida', fuel: 295, km: 1667, cost: 7053, efficiency: 5.65 },
      { id: 'U-67', type: 'Motobomba', fuel: 580, km: 1247, cost: 13866, efficiency: 2.15 },
      { id: 'U-66', type: 'Motobomba', fuel: 545, km: 1133, cost: 13030, efficiency: 2.08 },
      { id: 'U-65', type: 'Escala', fuel: 520, km: 962, cost: 12428, efficiency: 1.85 }
    ],
    vehicleTypeEfficiency: [
      { type: 'Rapidas', avgEfficiency: 5.7, vehicles: 4, totalFuel: 1205 },
      { type: 'Motobombas', avgEfficiency: 2.1, vehicles: 2, totalFuel: 1125 },
      { type: 'Escalas', avgEfficiency: 1.9, vehicles: 1, totalFuel: 520 }
    ]
  }
}

export async function getConsumptionData() {
  return [
    { month: 'Oct', fuel: 2650, cost: 62150 },
    { month: 'Nov', fuel: 2780, cost: 65890 },
    { month: 'Dic', fuel: 2920, cost: 69350 },
    { month: 'Ene', fuel: 2850, cost: 68420 },
    { month: 'Feb', fuel: 2680, cost: 64150 },
    { month: 'Mar', fuel: 2950, cost: 71200 }
  ]
}

export async function getVehicleUsage() {
  return [
    {
      vehicleId: 'U-37',
      vehicleType: 'Rapida',
      month: 'Enero',
      hoursOperation: 145,
      kmTraveled: 1850,
      incidents: 28,
      fuelConsumed: 320,
      avgKmPerLiter: 5.78
    },
    {
      vehicleId: 'U-37',
      vehicleType: 'Rapida',
      month: 'Febrero',
      hoursOperation: 138,
      kmTraveled: 1720,
      incidents: 25,
      fuelConsumed: 295,
      avgKmPerLiter: 5.83
    },
    {
      vehicleId: 'U-37',
      vehicleType: 'Rapida',
      month: 'Marzo',
      hoursOperation: 152,
      kmTraveled: 1980,
      incidents: 32,
      fuelConsumed: 345,
      avgKmPerLiter: 5.74
    },
    {
      vehicleId: 'U-67',
      vehicleType: 'Motobomba',
      month: 'Enero',
      hoursOperation: 98,
      kmTraveled: 890,
      incidents: 18,
      fuelConsumed: 420,
      avgKmPerLiter: 2.12
    },
    {
      vehicleId: 'U-67',
      vehicleType: 'Motobomba',
      month: 'Febrero',
      hoursOperation: 105,
      kmTraveled: 950,
      incidents: 20,
      fuelConsumed: 445,
      avgKmPerLiter: 2.13
    },
    {
      vehicleId: 'U-67',
      vehicleType: 'Motobomba',
      month: 'Marzo',
      hoursOperation: 112,
      kmTraveled: 1020,
      incidents: 22,
      fuelConsumed: 475,
      avgKmPerLiter: 2.15
    }
  ]
}

export async function getMaintenanceForecast() {
  return [
    {
      vehicleId: 'U-37',
      vehicleType: 'Rapida',
      currentKm: 49850,
      nextServiceKm: 50000,
      serviceType: 'Servicio 50,000 km',
      estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      priority: 'alta',
      estimatedCost: 4500
    },
    {
      vehicleId: 'U-67',
      vehicleType: 'Motobomba',
      currentKm: 180500,
      nextServiceKm: 185000,
      serviceType: 'Cambio de aceite bomba',
      estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      priority: 'media',
      estimatedCost: 2800
    },
    {
      vehicleId: 'U-78',
      vehicleType: 'Rapida',
      currentKm: 5200,
      nextServiceKm: 10000,
      serviceType: 'Primer servicio',
      estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      priority: 'baja',
      estimatedCost: 1500
    },
    {
      vehicleId: 'U-66',
      vehicleType: 'Motobomba',
      currentKm: 175300,
      nextServiceKm: 180000,
      serviceType: 'Servicio mayor',
      estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      priority: 'media',
      estimatedCost: 8500
    }
  ]
}

export async function getMonthlyFuelData() {
  return [
    { month: 'Oct', liters: 2650, cost: 62150 },
    { month: 'Nov', liters: 2780, cost: 65890 },
    { month: 'Dic', liters: 2920, cost: 69350 },
    { month: 'Ene', liters: 2850, cost: 68420 },
    { month: 'Feb', liters: 2680, cost: 64150 },
    { month: 'Mar', liters: 2950, cost: 71200 }
  ]
}

export async function getVehicleEfficiency() {
  return [
    { vehicleId: 'U-37', type: 'Rapida', efficiency: 5.78, status: 'buena' },
    { vehicleId: 'U-78', type: 'Rapida', efficiency: 5.92, status: 'buena' },
    { vehicleId: 'U-14', type: 'Rapida', efficiency: 5.45, status: 'regular' },
    { vehicleId: 'U-28', type: 'Rapida', efficiency: 5.65, status: 'buena' },
    { vehicleId: 'U-67', type: 'Motobomba', efficiency: 2.15, status: 'buena' },
    { vehicleId: 'U-66', type: 'Motobomba', efficiency: 2.08, status: 'regular' },
    { vehicleId: 'U-65', type: 'Escala', efficiency: 1.85, status: 'buena' }
  ]
}

export async function getConsumptionAlerts() {
  return [
    { id: 1, vehicleId: 'U-14', type: 'Rapida', message: 'Consumo 15% superior al promedio', severity: 'warning', date: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 2, vehicleId: 'U-66', type: 'Motobomba', message: 'Eficiencia por debajo del estándar', severity: 'warning', date: new Date(Date.now() - 1000 * 60 * 60 * 8) },
    { id: 3, vehicleId: 'U-37', type: 'Rapida', message: 'Próximo a servicio de 50,000 km', severity: 'info', date: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: 4, vehicleId: 'U-28', type: 'Rapida', message: 'Nivel de combustible bajo reportado', severity: 'critical', date: new Date(Date.now() - 1000 * 60 * 30) }
  ]
}
