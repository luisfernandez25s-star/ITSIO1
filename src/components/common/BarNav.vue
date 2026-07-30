<template>
  <div class="bar-nav">
    <div class="bar-nav-inner">

      <!-- Brand -->
      <div class="brand">
        <div class="brand-emblem">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
            <path d="M16 3L6 8v8c0 5.55 4.27 10.74 10 12 5.73-1.26 10-6.45 10-12V8L16 3z" fill="rgba(220,38,38,0.15)" stroke="#dc2626" stroke-width="1.5"/>
            <path d="M13 17l-3-3 1.4-1.4 1.6 1.6 4.6-4.6L19 11l-6 6z" fill="#dc2626"/>
          </svg>
        </div>
        <img src="@/assets/logoApp.png" alt="Logo" class="brand-logo">
        <div class="brand-text">
          <span class="brand-name">ITSIO</span>
          <span class="brand-sub">GESTIÓN OPERATIVA · BOMBEROS</span>
        </div>
      </div>

      <!-- Center indicators -->
      <div class="nav-center">
        <div class="indicator indicator--online">
          <span class="pulse-dot"></span>
          <span>SISTEMA EN LÍNEA</span>
        </div>
        <div class="indicator indicator--shift">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>GUARDIA ACTIVA</span>
        </div>
      </div>

      <!-- User info -->
      <div class="user-info">
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :aria-label="isDark ? 'Activar modo día' : 'Activar modo noche'"
          :title="isDark ? 'Modo día' : 'Modo noche'"
        >
          <!-- Sun: visible in dark mode, click to switch to day -->
          <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
          <!-- Moon: visible in light mode, click to switch to night -->
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <NotificationDropdown />
        <div class="user-meta">
          <span class="user-name">{{ name }}</span>
          <span class="user-position">{{ position }}</span>
        </div>
        <router-link to="/profile" class="user-avatar" aria-label="Mi perfil" title="Mi perfil">
          <span>{{ initials }}</span>
        </router-link>
        <button class="logout-btn" @click="logout" aria-label="Cerrar sesión" title="Cerrar sesión">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import NotificationDropdown from './NotificationDropdown.vue'

export default {
  name: 'BarNav',
  components: { NotificationDropdown },
  data() {
    return {
      position: "OFICIAL · 24-01",
      name: "Salomon Molina",
      isDark: true
    }
  },
  computed: {
    initials() {
      return this.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    }
  },
  mounted() {
    const saved = localStorage.getItem('itsio-theme')
    this.isDark = saved ? saved === 'dark' : true
    this.applyTheme()
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
      localStorage.setItem('itsio-theme', this.isDark ? 'dark' : 'light')
    },
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light')
    },
    logout() {
      // Solo frontend: limpia la sesion local y regresa al login.
      localStorage.removeItem('itsio-auth')
      localStorage.removeItem('itsio-user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.bar-nav {
  width: 100vw;
  height: 64px;
  background: var(--bg-nav);
  border-bottom: 1px solid rgba(220,38,38,0.2);
  transition: background var(--transition);
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

.bar-nav::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 300px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
}

.bar-nav-inner {
  width: 100%;
  max-width: 1600px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand */
.brand { display: flex; align-items: center; gap: 12px; }
.brand-emblem { display: flex; align-items: center; flex-shrink: 0; }

.brand-logo {
  height: 36px; width: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(220,38,38,0.4);
  background: var(--bg-card);
  padding: 2px;
}

.brand-text { display: flex; flex-direction: column; line-height: 1; }
.brand-name {
  font-family: var(--font-display);
  font-size: 1.4rem; font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.18em;
}
.brand-sub {
  font-family: var(--font-mono);
  font-size: 0.5rem;
  color: var(--text-muted);
  letter-spacing: 0.18em;
  margin-top: 3px;
  text-transform: uppercase;
}

/* Center */
.nav-center { display: flex; align-items: center; gap: 12px; }

.indicator {
  display: flex; align-items: center; gap: 7px;
  padding: 5px 14px;
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  border: 1px solid transparent;
}

.indicator--online {
  background: rgba(34,197,94,0.07);
  border-color: rgba(34,197,94,0.18);
  color: var(--accent-green);
}

.indicator--shift {
  background: rgba(220,38,38,0.07);
  border-color: rgba(220,38,38,0.18);
  color: var(--accent-secondary);
}

.pulse-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent-green);
  animation: pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }

/* User */
.user-info { display: flex; align-items: center; gap: 12px; }

/* Theme toggle */
.theme-toggle {
  width: 32px; height: 32px;
  border-radius: var(--radius);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.theme-toggle:hover {
  color: var(--accent-amber);
  border-color: var(--border-accent);
}

/* Logout button */
.logout-btn {
  width: 32px; height: 32px;
  border-radius: var(--radius);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.logout-btn:hover {
  color: var(--accent-secondary);
  border-color: var(--border-accent);
}

.notification-btn {
  position: relative;
  width: 32px; height: 32px;
  border-radius: var(--radius);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.notification-btn:hover { color: var(--accent-secondary); border-color: var(--border-accent); }

.notif-badge {
  position: absolute; top: -4px; right: -4px;
  background: var(--accent-primary);
  color: white;
  font-family: var(--font-mono);
  font-size: 0.5rem;
  width: 14px; height: 14px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #18181a;
}

.user-meta { display: flex; flex-direction: column; align-items: flex-end; }
.user-name {
  font-family: var(--font-display);
  font-size: 0.9rem; font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.06em;
}
.user-position {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--accent-secondary);
  letter-spacing: 0.15em;
}

.user-avatar {
  width: 36px; height: 36px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.05));
  border: 1.5px solid var(--border-accent);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-weight: 700; font-size: 0.82rem;
  color: var(--accent-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}
.user-avatar:hover {
  background: linear-gradient(135deg, rgba(220,38,38,0.35), rgba(220,38,38,0.1));
  border-color: var(--accent-primary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .bar-nav {
    height: 56px;
  }
  
  .bar-nav-inner {
    padding: 0 12px;
  }
  
  .brand-emblem {
    display: none;
  }
  
  .brand-logo {
    height: 32px;
    width: 32px;
  }
  
  .brand-name {
    font-size: 1.1rem;
  }
  
  .brand-sub {
    display: none;
  }
  
  .nav-center {
    display: none;
  }
  
  .user-meta {
    display: none;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
}

/* Android TV / Large Screens */
@media (min-width: 1920px) {
  .bar-nav {
    height: 80px;
  }
  
  .bar-nav-inner {
    padding: 0 48px;
    max-width: 100%;
  }
  
  .brand-logo {
    height: 48px;
    width: 48px;
  }
  
  .brand-name {
    font-size: 1.8rem;
  }
  
  .brand-sub {
    font-size: 0.6rem;
  }
  
  .indicator {
    font-size: 0.75rem;
    padding: 8px 20px;
  }
  
  .user-name {
    font-size: 1.1rem;
  }
  
  .user-position {
    font-size: 0.7rem;
  }
  
  .user-avatar {
    width: 48px;
    height: 48px;
    font-size: 1rem;
  }
}
</style>
