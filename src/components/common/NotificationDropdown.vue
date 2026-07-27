<template>
  <div class="notification-wrapper" ref="wrapper">
    <button class="notification-btn" @click="toggleDropdown" :class="{ 'is-open': isOpen }">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-panel">
        <div class="dropdown-header">
          <span class="dropdown-title">Notificaciones</span>
          <router-link to="/notifications" class="view-all-link" @click="isOpen = false">Ver todas</router-link>
        </div>

        <div class="dropdown-list">
          <div 
            v-for="notif in recentNotifications" 
            :key="notif.id" 
            class="notif-item"
            :class="{ 'is-unread': !notif.readAt }"
            @click="handleNotifClick(notif)"
          >
            <div class="notif-icon" :style="{ color: getPriorityColor(notif.priority) }" v-html="getNotificationIcon(notif.type)"></div>
            <div class="notif-content">
              <span class="notif-title">{{ notif.title }}</span>
              <span class="notif-message">{{ notif.message }}</span>
              <span class="notif-time">{{ formatTimeAgo(notif.createdAt) }}</span>
            </div>
            <div v-if="!notif.readAt" class="unread-dot"></div>
          </div>

          <div v-if="notifications.length === 0" class="empty-state">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span>No hay notificaciones</span>
          </div>
        </div>

        <div class="dropdown-footer">
          <button class="mark-read-btn" @click="markAllRead">Marcar todas como leídas</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getNotifications, getUnreadCount, formatTimeAgo, getNotificationIcon, getPriorityColor } from '@/components/scripts/getNotifications.js'

export default {
  name: 'NotificationDropdown',
  data() {
    return {
      isOpen: false,
      notifications: [],
      unreadCount: 0
    }
  },
  computed: {
    recentNotifications() {
      return this.notifications.slice(0, 5)
    }
  },
  async mounted() {
    await this.loadNotifications()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    formatTimeAgo,
    getNotificationIcon,
    getPriorityColor,
    async loadNotifications() {
      this.notifications = await getNotifications()
      this.unreadCount = await getUnreadCount()
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    handleClickOutside(e) {
      if (this.$refs.wrapper && !this.$refs.wrapper.contains(e.target)) {
        this.isOpen = false
      }
    },
    handleNotifClick(notif) {
      if (notif.actionUrl) {
        this.$router.push(notif.actionUrl)
      }
      this.isOpen = false
    },
    markAllRead() {
      this.notifications = this.notifications.map(n => ({ ...n, readAt: new Date() }))
      this.unreadCount = 0
    }
  }
}
</script>

<style scoped>
.notification-wrapper {
  position: relative;
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
.notification-btn:hover,
.notification-btn.is-open { 
  color: var(--accent-secondary); 
  border-color: var(--border-accent); 
  background: rgba(220,38,38,0.08);
}

.notif-badge {
  position: absolute; top: -4px; right: -4px;
  background: var(--accent-primary);
  color: white;
  font-family: var(--font-mono);
  font-size: 0.5rem;
  min-width: 14px; height: 14px;
  padding: 0 3px;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #18181a;
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.dropdown-title {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.04em;
}

.view-all-link {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--accent-secondary);
  text-decoration: none;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.view-all-link:hover { text-decoration: underline; }

.dropdown-list {
  max-height: 320px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.notif-item:hover { background: var(--bg-card-hover); }
.notif-item:last-child { border-bottom: none; }
.notif-item.is-unread { background: rgba(220,38,38,0.04); }

.notif-icon {
  width: 28px; height: 28px;
  border-radius: var(--radius);
  background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.notif-title {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notif-message {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.notif-time {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  margin-top: 2px;
}

.unread-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent-primary);
  flex-shrink: 0;
  margin-top: 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  color: var(--text-muted);
}
.empty-state span {
  font-family: var(--font-body);
  font-size: 0.8rem;
}

.dropdown-footer {
  padding: 10px 16px;
  border-top: 1px solid var(--border-subtle);
  background: rgba(0,0,0,0.15);
}

.mark-read-btn {
  width: 100%;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
}
.mark-read-btn:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
  border-color: var(--border-accent);
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
