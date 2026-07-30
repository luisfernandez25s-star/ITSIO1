<template>
  <div class="training-view">
    <div class="view-header">
      <div>
        <span class="section-tag">// CAPACITACION</span>
        <h2 class="view-title">Formacion y Certificaciones</h2>
      </div>
      <div class="header-actions">
        <button class="action-btn action-btn--secondary" @click="showCourseModal = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          Nuevo Curso
        </button>
        <button class="action-btn action-btn--primary" @click="showCertModal = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Registrar Certificacion
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon stat-icon--blue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ personnelStats.total }}</span>
          <span class="stat-label">Personal Total</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon--green">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ personnelStats.certified }}</span>
          <span class="stat-label">Certificados Vigentes</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon--orange">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ personnelStats.expiringSoon }}</span>
          <span class="stat-label">Vencen en 30 dias</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon--red">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ personnelStats.expired }}</span>
          <span class="stat-label">Certificados Vencidos</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="training-content">
      <!-- Left: Personnel List -->
      <div class="personnel-panel">
        <div class="panel-header">
          <h3 class="panel-title">Personal</h3>
          <div class="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" v-model="searchQuery" placeholder="Buscar personal..." class="search-input">
          </div>
        </div>
        <div class="personnel-list">
          <div 
            v-for="person in filteredPersonnel" 
            :key="person.id"
            class="personnel-card"
            :class="{ 'personnel-card--selected': selectedPerson?.id === person.id }"
            @click="selectedPerson = person"
          >
            <div class="personnel-avatar" :style="{ background: person.avatarColor }">
              {{ person.initials }}
            </div>
            <div class="personnel-info">
              <span class="personnel-name">{{ person.name }}</span>
              <span class="personnel-rank">{{ person.rank }} - Guardia {{ person.guard }}</span>
            </div>
            <div class="personnel-status">
              <span class="cert-count" :class="getCertStatusClass(person)">
                {{ person.validCerts }}/{{ person.totalCerts }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Certifications Detail -->
      <div class="certifications-panel">
        <div class="panel-header">
          <h3 class="panel-title">
            {{ selectedPerson ? `Certificaciones de ${selectedPerson.name}` : 'Selecciona un miembro' }}
          </h3>
          <div v-if="selectedPerson" class="filter-tabs">
            <button 
              v-for="tab in certTabs" 
              :key="tab.value"
              class="filter-tab"
              :class="{ 'filter-tab--active': certFilter === tab.value }"
              @click="certFilter = tab.value"
            >{{ tab.label }}</button>
          </div>
        </div>

        <div v-if="!selectedPerson" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <p>Selecciona un miembro del personal para ver sus certificaciones</p>
        </div>

        <div v-else class="certifications-grid">
          <div 
            v-for="cert in filteredCertifications" 
            :key="cert.id"
            class="cert-card"
            :class="`cert-card--${cert.status}`"
          >
            <div class="cert-header">
              <span class="cert-type-badge" :class="`badge--${cert.category}`">{{ cert.category }}</span>
              <span class="cert-status-badge" :class="`status--${cert.status}`">{{ getStatusLabel(cert.status) }}</span>
            </div>
            <h4 class="cert-name">{{ cert.name }}</h4>
            <div class="cert-meta">
              <div class="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>Emitido: {{ formatDate(cert.issuedDate) }}</span>
              </div>
              <div class="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Vence: {{ formatDate(cert.expiryDate) }}</span>
              </div>
              <div class="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <span>{{ cert.institution }}</span>
              </div>
            </div>
            <div class="cert-progress" v-if="cert.status === 'active'">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: cert.progressPercent + '%' }"></div>
              </div>
              <span class="progress-text">{{ cert.daysRemaining }} dias restantes</span>
            </div>
            <div class="cert-actions">
              <button class="cert-action" title="Ver detalles">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="cert-action" title="Descargar certificado">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button class="cert-action" title="Renovar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Courses Section -->
    <div class="courses-section">
      <div class="section-header">
        <h3 class="section-title">Proximos Cursos Programados</h3>
        <button class="view-all-btn">Ver calendario completo</button>
      </div>
      <div class="courses-grid">
        <div v-for="course in upcomingCourses" :key="course.id" class="course-card">
          <div class="course-date">
            <span class="date-day">{{ course.day }}</span>
            <span class="date-month">{{ course.month }}</span>
          </div>
          <div class="course-info">
            <h4 class="course-name">{{ course.name }}</h4>
            <p class="course-instructor">Instructor: {{ course.instructor }}</p>
            <div class="course-meta">
              <span class="meta-tag">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ course.duration }}
              </span>
              <span class="meta-tag">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                {{ course.enrolled }}/{{ course.capacity }}
              </span>
            </div>
          </div>
          <button class="enroll-btn">Inscribir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTrainingData, getPersonnelCertifications, getUpcomingCourses } from '@/components/scripts/getTraining';

export default {
  name: 'TrainingView',
  data() {
    return {
      personnel: [],
      selectedPerson: null,
      certifications: [],
      upcomingCourses: [],
      searchQuery: '',
      certFilter: 'all',
      showCourseModal: false,
      showCertModal: false,
      certTabs: [
        { label: 'Todas', value: 'all' },
        { label: 'Vigentes', value: 'active' },
        { label: 'Por Vencer', value: 'expiring' },
        { label: 'Vencidas', value: 'expired' }
      ]
    }
  },
  computed: {
    personnelStats() {
      return {
        total: this.personnel.length,
        certified: this.personnel.filter(p => p.validCerts === p.totalCerts).length,
        expiringSoon: this.personnel.reduce((acc, p) => acc + (p.expiringSoon || 0), 0),
        expired: this.personnel.reduce((acc, p) => acc + (p.expiredCerts || 0), 0)
      }
    },
    filteredPersonnel() {
      if (!this.searchQuery) return this.personnel;
      const query = this.searchQuery.toLowerCase();
      return this.personnel.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.rank.toLowerCase().includes(query)
      );
    },
    filteredCertifications() {
      if (this.certFilter === 'all') return this.certifications;
      return this.certifications.filter(c => c.status === this.certFilter);
    }
  },
  methods: {
    getCertStatusClass(person) {
      const ratio = person.validCerts / person.totalCerts;
      if (ratio === 1) return 'cert-count--good';
      if (ratio >= 0.7) return 'cert-count--warning';
      return 'cert-count--danger';
    },
    getStatusLabel(status) {
      const labels = {
        active: 'Vigente',
        expiring: 'Por Vencer',
        expired: 'Vencido'
      };
      return labels[status] || status;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    async loadPersonCertifications(person) {
      this.certifications = await getPersonnelCertifications(person.id);
    }
  },
  watch: {
    selectedPerson(newVal) {
      if (newVal) {
        this.loadPersonCertifications(newVal);
      }
    }
  },
  async mounted() {
    const data = await getTrainingData();
    this.personnel = data.personnel;
    this.upcomingCourses = await getUpcomingCourses();
    if (this.personnel.length > 0) {
      this.selectedPerson = this.personnel[0];
    }
  }
}
</script>

<style scoped>
.training-view { padding-top: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }

.view-header { display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
.section-tag { font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-primary); letter-spacing: 0.2em; display: block; margin-bottom: 4px; }
.view-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--text-primary); letter-spacing: 0.06em; }

.header-actions { display: flex; gap: 8px; }
.action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: var(--radius); font-family: var(--font-display); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
.action-btn--secondary { background: var(--bg-card); border-color: var(--border-subtle); color: var(--text-secondary); }
.action-btn--secondary:hover { border-color: var(--border-accent); color: var(--text-primary); }
.action-btn--primary { background: var(--accent-primary); color: #000; }
.action-btn--primary:hover { background: var(--accent-primary-hover); }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; flex-shrink: 0; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 14px; display: flex; align-items: center; gap: 12px; }
.stat-icon { width: 40px; height: 40px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon--blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.stat-icon--green { background: var(--accent-green-glow); color: var(--accent-green); }
.stat-icon--orange { background: var(--accent-orange-glow); color: var(--accent-orange); }
.stat-icon--red { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.stat-content { display: flex; flex-direction: column; }
.stat-value { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--text-primary); line-height: 1; }
.stat-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }

/* Main Content */
.training-content { display: flex; gap: 16px; flex: 1; min-height: 0; overflow: hidden; }

/* Personnel Panel */
.personnel-panel { width: 320px; flex-shrink: 0; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden; }
.panel-header { padding: 14px; border-bottom: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 10px; }
.panel-title { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: 0.05em; }

.search-box { display: flex; align-items: center; gap: 8px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius); padding: 6px 10px; }
.search-box svg { color: var(--text-muted); flex-shrink: 0; }
.search-input { flex: 1; background: none; border: none; color: var(--text-primary); font-family: var(--font-body); font-size: 0.8rem; outline: none; }
.search-input::placeholder { color: var(--text-muted); }

.personnel-list { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; }

.personnel-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: var(--radius); cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
.personnel-card:hover { background: var(--bg-secondary); }
.personnel-card--selected { background: var(--bg-secondary); border-color: var(--accent-primary); }

.personnel-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: #fff; flex-shrink: 0; }
.personnel-info { flex: 1; min-width: 0; }
.personnel-name { display: block; font-family: var(--font-body); font-size: 0.85rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.personnel-rank { display: block; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.05em; }

.cert-count { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 2px; }
.cert-count--good { background: var(--accent-green-glow); color: var(--accent-green); }
.cert-count--warning { background: var(--accent-orange-glow); color: var(--accent-orange); }
.cert-count--danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

/* Certifications Panel */
.certifications-panel { flex: 1; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden; }
.certifications-panel .panel-header { flex-direction: row; align-items: center; justify-content: space-between; }

.filter-tabs { display: flex; gap: 4px; }
.filter-tab { padding: 5px 12px; border-radius: var(--radius); background: transparent; border: 1px solid var(--border-subtle); color: var(--text-muted); font-family: var(--font-display); font-size: 0.7rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.filter-tab:hover { color: var(--text-primary); border-color: var(--text-muted); }
.filter-tab--active { background: var(--accent-primary); color: #000; border-color: var(--accent-primary); }

.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--text-muted); }
.empty-state svg { opacity: 0.5; }
.empty-state p { font-family: var(--font-body); font-size: 0.85rem; }

.certifications-grid { flex: 1; overflow-y: auto; padding: 14px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; align-content: start; }

.cert-card { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 14px; display: flex; flex-direction: column; gap: 10px; transition: all 0.2s; }
.cert-card:hover { border-color: var(--border-accent); }
.cert-card--expired { border-left: 3px solid #ef4444; }
.cert-card--expiring { border-left: 3px solid var(--accent-orange); }
.cert-card--active { border-left: 3px solid var(--accent-green); }

.cert-header { display: flex; justify-content: space-between; align-items: center; }
.cert-type-badge { font-family: var(--font-mono); font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px 6px; border-radius: 2px; }
.badge--obligatorio { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
.badge--especialidad { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.badge--complementario { background: rgba(107, 114, 128, 0.15); color: #6b7280; }

.cert-status-badge { font-family: var(--font-mono); font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.08em; padding: 2px 6px; border-radius: 2px; }
.status--active { background: var(--accent-green-glow); color: var(--accent-green); }
.status--expiring { background: var(--accent-orange-glow); color: var(--accent-orange); }
.status--expired { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

.cert-name { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: 0.03em; }

.cert-meta { display: flex; flex-direction: column; gap: 4px; }
.meta-item { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.05em; }

.cert-progress { margin-top: 4px; }
.progress-bar { height: 4px; background: var(--bg-primary); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent-green); border-radius: 2px; transition: width 0.3s; }
.progress-text { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-muted); margin-top: 4px; display: block; }

.cert-actions { display: flex; gap: 6px; margin-top: auto; padding-top: 8px; border-top: 1px solid var(--border-subtle); }
.cert-action { width: 28px; height: 28px; border-radius: var(--radius); background: var(--bg-card); border: 1px solid var(--border-subtle); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.cert-action:hover { color: var(--accent-primary); border-color: var(--accent-primary); }

/* Courses Section */
.courses-section { flex-shrink: 0; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 14px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-title { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: 0.05em; }
.view-all-btn { background: none; border: none; color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.1em; cursor: pointer; transition: color 0.2s; }
.view-all-btn:hover { color: var(--accent-primary-hover); }

.courses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

.course-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius); transition: all 0.2s; }
.course-card:hover { border-color: var(--border-accent); }

.course-date { width: 50px; height: 50px; background: var(--accent-primary); border-radius: var(--radius); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
.date-day { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: #000; line-height: 1; }
.date-month { font-family: var(--font-mono); font-size: 0.55rem; color: rgba(0,0,0,0.7); text-transform: uppercase; letter-spacing: 0.1em; }

.course-info { flex: 1; min-width: 0; }
.course-name { font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--text-primary); margin: 0 0 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.course-instructor { font-family: var(--font-body); font-size: 0.7rem; color: var(--text-muted); margin: 0 0 4px 0; }
.course-meta { display: flex; gap: 8px; }
.meta-tag { display: flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-muted); letter-spacing: 0.05em; }

.enroll-btn { padding: 6px 12px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius); color: var(--text-secondary); font-family: var(--font-display); font-size: 0.7rem; font-weight: 600; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.enroll-btn:hover { background: var(--accent-primary); color: #000; border-color: var(--accent-primary); }
</style>
