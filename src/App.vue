<template>
  <!-- Login (and other public views) render without the app chrome -->
  <router-view v-if="hideChrome" />

  <div v-else class="app" :class="{ 'tv-mode': isTvMode }">
    <BarNav />
    <div class="body-app">
      <SizeBar v-if="!isMobile" />
      <MobileNav v-if="isMobile" />
      <router-view class="body-views"/>
    </div>
    <!-- TV Navigation Hint -->
    <div class="tv-nav-hint" v-if="isTvMode">
      <span><kbd>Arrow</kbd> Navegar</span>
      <span><kbd>Enter</kbd> Seleccionar</span>
      <span><kbd>Back</kbd> Regresar</span>
    </div>
  </div>
</template>

<script>
import BarNav from './components/common/BarNav.vue'
import SizeBar from './components/common/SizeBar.vue';
import MobileNav from './components/common/MobileNav.vue';

export default {
  name: 'App',
  components: { BarNav, SizeBar, MobileNav },
  data() {
    return {
      isMobile: false,
      isTvMode: false
    }
  },
  computed: {
    hideChrome() {
      return this.$route.meta.hideChrome === true
    }
  },
  mounted() {
    this.checkDevice()
    window.addEventListener('resize', this.checkDevice)
    this.setupTvNavigation()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDevice)
  },
  methods: {
    checkDevice() {
      this.isMobile = window.innerWidth <= 768
      // Detect TV: large screen with no fine pointer (no mouse)
      this.isTvMode = window.innerWidth >= 1920 && !window.matchMedia('(pointer: fine)').matches
      // Also check for Android TV user agent
      if (navigator.userAgent.includes('Android TV') || navigator.userAgent.includes('AFTT')) {
        this.isTvMode = true
      }
    },
    setupTvNavigation() {
      // Enable spatial navigation for TV remotes
      document.addEventListener('keydown', (e) => {
        if (!this.isTvMode) return
        
        const focusable = Array.from(document.querySelectorAll('button, a, select, input, [tabindex]:not([tabindex="-1"])'))
        const current = document.activeElement
        const currentIndex = focusable.indexOf(current)
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault()
          const next = focusable[currentIndex + 1] || focusable[0]
          next?.focus()
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault()
          const prev = focusable[currentIndex - 1] || focusable[focusable.length - 1]
          prev?.focus()
        }
      })
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700&display=swap');

:root {
  /* Firefighter Red Palette */
  --bg-primary: #1e1e20;
  --bg-secondary: #242426;
  --bg-card: #2c2c2f;
  --bg-card-hover: #343438;
  --border-subtle: rgba(255,255,255,0.09);
  --border-accent: rgba(220, 38, 38, 0.45);

  /* Brand colors - firefighter red */
  --accent-primary: #dc2626;
  --accent-secondary: #ef4444;
  --accent-glow: rgba(220, 38, 38, 0.18);
  --accent-amber: #f59e0b;
  --accent-amber-glow: rgba(245, 158, 11, 0.15);

  /* Status */
  --accent-green: #22c55e;
  --accent-green-glow: rgba(34, 197, 94, 0.12);
  --accent-red: #ef4444;
  --accent-blue: #3b82f6;
  --accent-orange: #f97316;
  --accent-orange-glow: rgba(249, 115, 22, 0.12);

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #e5e7eb;
  --text-muted: #9ca3af;

  /* Typography */
  --font-display: 'Rajdhani', sans-serif;
  --font-mono: 'Share Tech Mono', monospace;
  --font-body: 'Exo 2', sans-serif;

  /* Surfaces */
  --bg-nav: #18181a;

  /* Effects */
  --shadow-glow: 0 0 24px rgba(220, 38, 38, 0.12);
  --shadow-card: 0 4px 16px rgba(0,0,0,0.4);
  --radius: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --transition: 0.2s ease;
}

/* ============================================
   LIGHT THEME (DAY MODE)
   ============================================ */
:root[data-theme="light"] {
  --bg-primary: #eef0f3;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --bg-card-hover: #f3f4f6;
  --border-subtle: rgba(17, 24, 39, 0.10);
  --border-accent: rgba(220, 38, 38, 0.35);

  --accent-glow: rgba(220, 38, 38, 0.10);
  --accent-amber-glow: rgba(245, 158, 11, 0.12);
  --accent-green-glow: rgba(34, 197, 94, 0.12);
  --accent-orange-glow: rgba(249, 115, 22, 0.12);

  --text-primary: #18181a;
  --text-secondary: #374151;
  --text-muted: #6b7280;

  --bg-nav: #ffffff;

  --shadow-glow: 0 0 24px rgba(220, 38, 38, 0.10);
  --shadow-card: 0 4px 16px rgba(17, 24, 39, 0.08);
}

*, *::before, *::after { box-sizing: border-box; }

body {
  background: var(--bg-primary);
  margin: 0;
  font-family: var(--font-body);
  color: var(--text-primary);
  transition: background var(--transition), color var(--transition);
}

.app {
  display: flex;
  width: 100vw;
  top: 0; left: 0;
  position: fixed;
  background: var(--bg-primary);
  flex-direction: column;
  align-items: center;
}

.body-app {
  width: 100vw;
  max-width: 1600px;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-subtle);
  border-right: 1px solid var(--border-subtle);
}

.body-views {
  width: 100%;
  flex: 1;
  overflow: hidden;
  padding: 0 28px 16px 28px;
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--accent-primary); border-radius: 2px; }

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: 2px;
}
.status-operativa  { background: var(--accent-green-glow);   color: var(--accent-green);  border: 1px solid rgba(34,197,94,0.3);  }
.status-taller     { background: var(--accent-orange-glow);  color: var(--accent-orange); border: 1px solid rgba(249,115,22,0.3); }
.status-in-operativa { background: rgba(239,68,68,0.1); color: var(--accent-red); border: 1px solid rgba(239,68,68,0.3); }

/* Section tag utility */
.section-tag {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--accent-secondary);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
}

/* Divider line */
.divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 0;
}

/* ============================================
   MOBILE RESPONSIVE (< 768px)
   ============================================ */
@media (max-width: 768px) {
  .app {
    position: relative;
  }
  
  .body-app {
    height: calc(100vh - 56px);
    border: none;
  }
  
  .body-views {
    padding: 0 12px 80px 12px;
    overflow-y: auto;
  }
  
  .section-tag {
    font-size: 0.55rem;
  }
  
  .status-badge {
    font-size: 0.6rem;
    padding: 2px 8px;
  }
}

/* ============================================
   ANDROID TV / LARGE SCREENS (> 1920px)
   ============================================ */
@media (min-width: 1920px) {
  :root {
    --tv-scale: 1.25;
  }
  
  .app {
    font-size: calc(1rem * var(--tv-scale));
  }
  
  .body-app {
    max-width: 100%;
    height: calc(100vh - 80px);
  }
  
  .body-views {
    padding: 0 48px 32px 48px;
  }
  
  .section-tag {
    font-size: 0.75rem;
  }
  
  .status-badge {
    font-size: 0.8rem;
    padding: 6px 16px;
  }
}

/* ============================================
   TV NAVIGATION - D-PAD FOCUS STYLES
   ============================================ */
.tv-mode *:focus {
  outline: 3px solid var(--accent-secondary) !important;
  outline-offset: 4px;
  box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.3) !important;
}

.tv-mode button:focus,
.tv-mode a:focus,
.tv-mode select:focus,
.tv-mode input:focus,
.tv-mode [tabindex]:focus {
  transform: scale(1.02);
  transition: all 0.15s ease;
}

.tv-mode .nav-link:focus {
  background: rgba(220,38,38,0.15) !important;
  border-color: var(--accent-secondary) !important;
}

/* TV-specific larger touch targets */
@media (min-width: 1920px) and (pointer: coarse),
       (min-width: 1920px) and (any-hover: none) {
  button, a, select, input, [tabindex] {
    min-height: 48px;
    min-width: 48px;
  }
}

/* Spatial navigation hint for TV */
.tv-nav-hint {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  padding: 12px 24px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  display: none;
  gap: 16px;
  z-index: 1000;
}

.tv-mode .tv-nav-hint {
  display: flex;
}

.tv-nav-hint span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tv-nav-hint kbd {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
}
</style>
