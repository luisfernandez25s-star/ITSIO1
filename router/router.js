import { createRouter, createWebHistory } from 'vue-router'
import WellcomeView from '@/views/WellcomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import NotFound from '@/views/NotFound.vue'
import typeToVehicles from '@/views/typeToVehiclesView.vue'
import toolsView from '@/views/toolsView.vue'
import stateforceView from '@/views/stateforceView.vue'
import allVehiclesByType from '@/views/allVehiclesByType.vue'
import menuVehicleView from '@/views/menuVehicleView.vue'

// New modules
import { getSession, canAccess } from '@/utils/usersMock.js'
import AnalyticsView from '@/views/AnalyticsView.vue'
import IncidentsView from '@/views/IncidentsView.vue'
import DispatchView from '@/views/DispatchView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import TrainingView from '@/views/TrainingView.vue'
import FleetAnalyticsView from '@/views/FleetAnalyticsView.vue'
import EquipmentView from '@/views/EquipmentView.vue'
import ReportsView from '@/views/ReportsView.vue'
import EfficiencyView from '@/views/EfficiencyView.vue'

const routes = [
  { path: '/login', name: 'LoginView', component: LoginView, meta: { public: true, hideChrome: true } },
  { path: '/', name: 'WellcomeView', component: WellcomeView, meta: { perm: 'wellcome' } },
  { path: '/profile', name: 'ProfileView', component: ProfileView }, // sin perm: siempre disponible
  { path: '/typeToVehicles', name: 'typeToVehicles', component: typeToVehicles, meta: { perm: 'typeToVehicles' } },
  { path: '/type-vehicle/:type', name: 'allVehiclesByType', component: allVehiclesByType, meta: { perm: 'typeToVehicles' } },
  { path: '/type-vehicle/description-u/:numberVehicle', name: 'menuVehicleView', component: menuVehicleView, meta: { perm: 'typeToVehicles' } },
  { path: '/stateforce', name: 'stateforceView', component: stateforceView, meta: { perm: 'stateforce' } },
  { path: '/tools', name: 'toolsView', component: EquipmentView, meta: { perm: 'tools' } },
  { path: '/reports', name: 'ReportsView', component: ReportsView, meta: { perm: 'reports' } },
  
  // New routes
  { path: '/analytics', name: 'AnalyticsView', component: AnalyticsView, meta: { perm: 'analytics' } },
  { path: '/incidents', name: 'IncidentsView', component: IncidentsView, meta: { perm: 'incidents' } },
  { path: '/dispatch', name: 'DispatchView', component: DispatchView, meta: { perm: 'dispatch' } },
  { path: '/notifications', name: 'NotificationsView', component: NotificationsView }, // sin perm
  { path: '/training', name: 'TrainingView', component: TrainingView, meta: { perm: 'training' } },
  { path: '/fleet-analytics', name: 'FleetAnalyticsView', component: FleetAnalyticsView, meta: { perm: 'fleet-analytics' } },
  { path: '/efficiency', name: 'EfficiencyView', component: EfficiencyView, meta: { perm: 'efficiency' } },
  
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardia de navegacion (solo frontend).
// El backend reemplazara esta comprobacion por una sesion/token real.
router.beforeEach((to) => {
  const isAuthenticated = localStorage.getItem('itsio-auth') === 'true'

  // Rutas publicas (login) no requieren sesion.
  if (to.meta.public) {
    // Si ya inicio sesion, mandarlo al panel principal.
    if (isAuthenticated && to.name === 'LoginView') {
      return { path: '/' }
    }
    return true
  }

  // Rutas protegidas: sin sesion -> al login.
  if (!isAuthenticated) {
    return { path: '/login' }
  }

  // Control por rango: si la ruta exige un permiso y el rango del
  // usuario no lo tiene, se le regresa a su pantalla de inicio.
  if (to.meta.perm) {
    const session = getSession()
    const roleKey = (session && session.roleKey) || 'bombero'
    if (!canAccess(roleKey, to.meta.perm)) {
      return { path: '/' }
    }
  }

  return true
})

export default router
