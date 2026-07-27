import { api } from '@/utils/api'

// Tipos de vehiculo con conteo operativas / taller
export async function getAllTypeToVehicles() {
  return api.get('/vehicle-types')
}

// Vehiculos de un tipo, filtrados por status ("todas" = todos)
export async function getTypeVehicles(typeUnit, status) {
  const params = new URLSearchParams({ type: typeUnit, status })
  return api.get(`/vehicles?${params.toString()}`)
}

// Detalle de un vehiculo por numero de unidad
export async function getTypeVehicle(numberUnit) {
  return api.get(`/vehicles/${numberUnit}`)
}
