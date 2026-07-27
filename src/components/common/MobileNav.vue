<template>
  <nav class="mobile-nav">
    <router-link
      v-for="item in mainNavItems"
      :key="item.route"
      :to="item.route === 'wellcome' ? '/' : `/${item.route}`"
      class="mobile-nav-item"
      active-class="mobile-nav-item--active"
    >
      <span class="mobile-nav-icon" v-html="item.icon"></span>
      <span class="mobile-nav-label">{{ item.label }}</span>
    </router-link>
    
    <button class="mobile-nav-item mobile-nav-more" @click="showMore = !showMore">
      <span class="mobile-nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
        </svg>
      </span>
      <span class="mobile-nav-label">Mas</span>
    </button>

    <!-- More menu overlay -->
    <transition name="slide-up">
      <div v-if="showMore" class="mobile-more-menu" @click.self="showMore = false">
        <div class="more-menu-content">
          <div class="more-menu-header">
            <span>Menu</span>
            <button class="more-close" @click="showMore = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="more-menu-grid">
            <router-link
              v-for="item in visibleNavItems"
              :key="item.route"
              :to="item.route === 'wellcome' ? '/' : `/${item.route}`"
              class="more-menu-item"
              @click="showMore = false"
            >
              <span class="more-item-icon" v-html="item.icon"></span>
              <span class="more-item-label">{{ item.label }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import { getSession, canAccess } from '@/utils/usersMock.js'

export default {
  name: 'MobileNav',
  data() {
    return {
      showMore: false,
      allNavItems: [
        { route: 'wellcome', label: 'Inicio', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
        { route: 'analytics', label: 'Dashboard', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
        { route: 'dispatch', label: 'Despacho', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>` },
        { route: 'incidents', label: 'Incidentes', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
        { route: 'stateforce', label: 'Fuerza', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
        { route: 'typeToVehicles', label: 'Flota', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
        { route: 'fleet-analytics', label: 'Combustible', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>` },
        { route: 'tools', label: 'Equipo', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>` },
        { route: 'training', label: 'Capacitacion', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>` },
        { route: 'reports', label: 'Reportes', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
        { route: 'efficiency', label: 'Eficiencia', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>` }
      ]
    }
  },
  computed: {
    mainNavItems() {
      // Show only 4 main items in bottom nav
      return this.allNavItems.slice(0, 4)
    }
  }
}
</script>

<style scoped>
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #18181a;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 8px;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: var(--radius);
}

.mobile-nav-item:active {
  transform: scale(0.95);
}

.mobile-nav-item--active {
  color: var(--accent-secondary);
}

.mobile-nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav-label {
  font-family: var(--font-display);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* More menu overlay */
.mobile-more-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
}

.more-menu-content {
  width: 100%;
  background: var(--bg-secondary);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0));
  max-height: 70vh;
  overflow-y: auto;
}

.more-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.more-menu-header span {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.more-close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}

.more-menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.more-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.more-menu-item:active {
  background: rgba(220,38,38,0.1);
  border-color: var(--border-accent);
}

.more-item-icon {
  display: flex;
  color: var(--accent-secondary);
}

.more-item-label {
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.03em;
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .more-menu-content,
.slide-up-leave-to .more-menu-content {
  transform: translateY(100%);
}
</style>
