<template>
  <div class="reports-view">
    <div class="view-header">
      <div>
        <span class="section-tag">// SISTEMA - REPORTES</span>
        <h2 class="view-title">Reportes y Exportacion</h2>
      </div>
    </div>

    <div class="reports-grid">
      <!-- Reports section -->
      <div class="report-section">
        <div class="rs-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          REPORTES DISPONIBLES
        </div>
        <div class="report-cards">
          <div v-for="r in reports" :key="r.id" class="report-card">
            <div :class="['report-icon', `report-icon--${r.color}`]" v-html="r.icon"></div>
            <div class="report-info">
              <span class="report-name">{{ r.name }}</span>
              <span class="report-desc">{{ r.desc }}</span>
            </div>
            <div class="report-actions">
              <button class="report-btn" @click="generateReport(r, 'csv')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                CSV
              </button>
              <button class="report-btn" @click="generateReport(r, 'pdf')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- System info section -->
      <div class="system-section">
        <div class="rs-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          ESTADO DEL SISTEMA
        </div>
        <div class="sys-stats">
          <div v-for="s in sysStats" :key="s.id" class="sys-stat">
            <span class="sys-label">{{ s.label }}</span>
            <div class="sys-bar-wrap">
              <div class="sys-bar"><div :class="['sys-fill', `sys-fill--${s.color}`]" :style="{width: s.val+'%'}"></div></div>
              <span :class="['sys-val', `sys-val--${s.color}`]">{{ s.val }}%</span>
            </div>
          </div>
        </div>
        <div class="sys-info-rows">
          <div v-for="i in sysInfo" :key="i.label" class="sys-info-row">
            <span class="si-label">{{ i.label }}</span>
            <span :class="['si-value', i.highlight ? 'si-value--accent' : '']">{{ i.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent exports -->
    <div class="recent-section">
      <div class="rs-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        EXPORTACIONES RECIENTES
      </div>
      <div class="recent-list">
        <div v-for="exp in recentExports" :key="exp.id" class="recent-item">
          <div :class="['recent-icon', `recent-icon--${exp.type}`]">
            <svg v-if="exp.type === 'csv'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="recent-info">
            <span class="recent-name">{{ exp.name }}</span>
            <span class="recent-date">{{ exp.date }}</span>
          </div>
          <span class="recent-size">{{ exp.size }}</span>
          <button class="recent-download" @click="downloadRecent(exp)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportsView',
  data() {
    return {
      reports: [
        {
          id: 1, name: 'Reporte de Flota', color: 'red',
          desc: 'Estado actual de todas las unidades vehiculares',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
        },
        {
          id: 2, name: 'Bitacoras de Servicio', color: 'amber',
          desc: 'Historial de incidentes y servicios prestados',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
        },
        {
          id: 3, name: 'Estado de Fuerza', color: 'blue',
          desc: 'Reporte de personal activo y guardias',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`
        },
        {
          id: 4, name: 'Mantenimientos', color: 'green',
          desc: 'Historial de taller y proximos servicios',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`
        },
        {
          id: 5, name: 'Inventario de Equipo', color: 'cyan',
          desc: 'Estado del equipo y herramientas',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
        },
        {
          id: 6, name: 'Incidentes', color: 'orange',
          desc: 'Historial de emergencias atendidas',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
        },
      ],
      sysStats: [
        { id: 1, label: 'Disponibilidad de Flota', val: 73, color: 'green' },
        { id: 2, label: 'Ocupacion de Personal', val: 75, color: 'blue' },
        { id: 3, label: 'Unidades en Servicio', val: 17, color: 'orange' },
      ],
      sysInfo: [
        { label: 'Version del Sistema', value: 'ITSIO v2.0.0' },
        { label: 'Ultima Actualizacion', value: '22 May 2026', highlight: false },
        { label: 'Registros Totales', value: '1,248' },
        { label: 'Estado API', value: 'CONECTADO', highlight: true },
        { label: 'Base de Datos', value: 'ACTIVA', highlight: true },
      ],
      recentExports: [
        { id: 1, name: 'Reporte_Flota_May2026.csv', type: 'csv', date: 'Hace 2 horas', size: '245 KB' },
        { id: 2, name: 'Estado_Fuerza_Semana21.pdf', type: 'pdf', date: 'Hace 1 dia', size: '1.2 MB' },
        { id: 3, name: 'Bitacora_Servicio_U37.csv', type: 'csv', date: 'Hace 3 dias', size: '89 KB' },
        { id: 4, name: 'Mantenimientos_Abril2026.pdf', type: 'pdf', date: 'Hace 1 semana', size: '2.1 MB' },
      ]
    }
  },
  methods: {
    generateReport(report, format) {
      let content = ''
      let filename = ''
      const now = new Date()
      const dateStr = now.toLocaleDateString('es-MX').replace(/\//g, '-')
      
      if (format === 'csv') {
        // Generate CSV content based on report type
        switch(report.id) {
          case 1: // Flota
            content = 'Unidad,Tipo,Estado,Kilometraje,Ubicacion\n'
            content += 'U-37,Rapida,Operativa,49850,Estacion Central\n'
            content += 'U-78,Rapida,Operativa,5200,Estacion Central\n'
            content += 'U-67,Motobomba,En Servicio,180500,Emergencia\n'
            content += 'U-66,Motobomba,Operativa,175300,Estacion Central\n'
            content += 'U-65,Escala,Mantenimiento,95000,Taller\n'
            content += 'U-28,Rapida,Operativa,62400,Estacion Central\n'
            content += 'U-14,Rapida,Operativa,45200,Estacion Norte\n'
            filename = `Reporte_Flota_${dateStr}.csv`
            break
          case 2: // Bitacoras
            content = 'Fecha,Incidente,Tipo,Unidad,Tiempo Respuesta,Estado\n'
            content += '2026-05-28,INC-4589,Incendio,U-37,4.5 min,Completado\n'
            content += '2026-05-28,INC-4588,Rescate,U-78,3.2 min,Completado\n'
            content += '2026-05-27,INC-4587,Emergencia Medica,U-67,5.1 min,Completado\n'
            content += '2026-05-27,INC-4586,Incendio Vehicular,U-37,3.8 min,Completado\n'
            filename = `Bitacoras_Servicio_${dateStr}.csv`
            break
          case 3: // Estado de Fuerza
            content = 'Nombre,Rango,Guardia,Estado,Certificaciones\n'
            content += 'Cap. Jorge Garcia,Capitan,A,Activo,8/8\n'
            content += 'Tte. Roberto Sanchez,Teniente,A,Activo,5/6\n'
            content += 'Bro. Carlos Mendez,Bombero,B,Activo,4/4\n'
            content += 'Bro. Luis Hernandez,Bombero,B,Activo,3/4\n'
            content += 'Bro. Pedro Ramirez,Bombero,C,Activo,5/5\n'
            content += 'Bro. Ana Lopez,Bombero,C,Activo,4/4\n'
            filename = `Estado_Fuerza_${dateStr}.csv`
            break
          case 4: // Mantenimientos
            content = 'Unidad,Tipo Mantenimiento,Fecha,Estado,Costo\n'
            content += 'U-65,Preventivo,2026-05-15,Completado,$12500\n'
            content += 'U-37,Cambio Aceite,2026-05-10,Completado,$2800\n'
            content += 'U-67,Revision Frenos,2026-05-08,Completado,$4500\n'
            content += 'U-78,Preventivo,2026-06-01,Programado,$15000\n'
            filename = `Mantenimientos_${dateStr}.csv`
            break
          case 5: // Inventario
            content = 'Codigo,Nombre,Categoria,Cantidad,Estado,Ubicacion\n'
            content += 'EPP-001,Casco Estructural,EPP,20,Operativo,Almacen\n'
            content += 'EPP-005,SCBA (ERA),EPP,12,Operativo,Unidades\n'
            content += 'HYD-001,Cizalla Hidraulica,Hidraulico,2,Operativo,U-37\n'
            content += 'MED-001,DEA,Medico,3,Operativo,Unidades\n'
            filename = `Inventario_Equipo_${dateStr}.csv`
            break
          case 6: // Incidentes
            content = 'ID,Fecha,Tipo,Direccion,Prioridad,Tiempo Respuesta,Unidades\n'
            content += 'INC-4589,2026-05-28,Incendio Estructural,Av. Central 456,Alta,4.5 min,U-37 U-67\n'
            content += 'INC-4588,2026-05-28,Rescate Vehicular,Blvd. Norte 123,Alta,3.2 min,U-78\n'
            content += 'INC-4587,2026-05-27,Emergencia Medica,Calle 5 de Mayo 789,Media,5.1 min,U-67\n'
            filename = `Incidentes_${dateStr}.csv`
            break
          default:
            content = 'Sin datos disponibles'
            filename = `Reporte_${dateStr}.csv`
        }
        
        // Download CSV
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Add to recent exports
        this.recentExports.unshift({
          id: Date.now(),
          name: filename,
          type: 'csv',
          date: 'Ahora mismo',
          size: `${Math.round(content.length / 1024 * 10) / 10 || 1} KB`
        })
        
      } else if (format === 'pdf') {
        // For PDF, we create a printable HTML that can be saved as PDF
        const printWindow = window.open('', '_blank')
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${report.name} - ITSIO</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; }
              h2 { color: #333; margin-top: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background: #f5f5f5; font-weight: bold; }
              .header { display: flex; justify-content: space-between; align-items: center; }
              .date { color: #666; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>ITSIO - ${report.name}</h1>
              <span class="date">Generado: ${now.toLocaleString('es-MX')}</span>
            </div>
            <p>${report.desc}</p>
            <h2>Datos del Reporte</h2>
            <p>Use Ctrl+P o Cmd+P para guardar como PDF</p>
            <div class="footer">
              Sistema ITSIO v2.0.0 - Gestion Operativa de Bomberos
            </div>
          </body>
          </html>
        `
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        
        // Add to recent exports
        this.recentExports.unshift({
          id: Date.now(),
          name: `${report.name.replace(/ /g, '_')}_${dateStr}.pdf`,
          type: 'pdf',
          date: 'Ahora mismo',
          size: '~1 MB'
        })
      }
    },
    downloadRecent(exp) {
      // Generate content based on type and name
      let content = ''
      const isFlota = exp.name.toLowerCase().includes('flota')
      const isBitacora = exp.name.toLowerCase().includes('bitacora')
      const isEstado = exp.name.toLowerCase().includes('estado') || exp.name.toLowerCase().includes('fuerza')
      const isMantenimiento = exp.name.toLowerCase().includes('mantenimiento')
      
      if (exp.type === 'csv') {
        if (isFlota) {
          content = 'Unidad,Tipo,Estado,Kilometraje,Ubicacion\n'
          content += 'U-37,Rapida,Operativa,49850,Estacion Central\n'
          content += 'U-78,Rapida,Operativa,5200,Estacion Central\n'
          content += 'U-67,Motobomba,En Servicio,180500,Emergencia\n'
          content += 'U-66,Motobomba,Operativa,175300,Estacion Central\n'
          content += 'U-65,Escala,Mantenimiento,95000,Taller\n'
        } else if (isBitacora) {
          content = 'Fecha,Incidente,Tipo,Unidad,Tiempo Respuesta,Estado\n'
          content += '2026-05-28,INC-4589,Incendio,U-37,4.5 min,Completado\n'
          content += '2026-05-28,INC-4588,Rescate,U-78,3.2 min,Completado\n'
          content += '2026-05-27,INC-4587,Emergencia Medica,U-67,5.1 min,Completado\n'
        } else if (isEstado) {
          content = 'Nombre,Rango,Guardia,Estado,Certificaciones\n'
          content += 'Cap. Jorge Garcia,Capitan,A,Activo,8/8\n'
          content += 'Tte. Roberto Sanchez,Teniente,A,Activo,5/6\n'
          content += 'Bro. Carlos Mendez,Bombero,B,Activo,4/4\n'
        } else {
          content = 'Datos del reporte exportado\n'
          content += 'Archivo: ' + exp.name + '\n'
          content += 'Fecha de generacion: ' + new Date().toLocaleString('es-MX') + '\n'
        }
        
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = exp.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      } else if (exp.type === 'pdf') {
        // Generate PDF content in new window
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>${exp.name} - ITSIO</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #f5f5f5; font-weight: bold; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <h1>ITSIO - ${exp.name.replace(/_/g, ' ')}</h1>
              <p>Archivo recuperado de exportaciones recientes</p>
              <p>Fecha original: ${exp.date}</p>
              <p>Tamano: ${exp.size}</p>
              <p style="margin-top: 20px;"><strong>Use Ctrl+P o Cmd+P para guardar como PDF</strong></p>
              <div class="footer">
                Sistema ITSIO v2.0.0 - Gestion Operativa de Bomberos
              </div>
            </body>
            </html>
          `
          printWindow.document.write(htmlContent)
          printWindow.document.close()
        }
      }
    }
  }
}
</script>

<style scoped>
.reports-view { padding-top: 20px; height: 100%; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }
.view-header { display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
.view-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--text-primary); letter-spacing: 0.06em; }

.reports-grid { display: grid; grid-template-columns: 1fr 360px; gap: 16px; flex: 1; min-height: 0; overflow: hidden; }

.report-section, .system-section {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden;
}

.rs-header {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: 0.6rem;
  color: var(--accent-secondary); letter-spacing: 0.18em;
  padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); flex-shrink: 0;
}

.report-cards { display: flex; flex-direction: column; gap: 0; overflow-y: auto; flex: 1; }
.report-card {
  display: flex; align-items: center; gap: 14px;
  padding: 16px; border-bottom: 1px solid var(--border-subtle);
  transition: background 0.2s;
}
.report-card:last-child { border-bottom: none; }
.report-card:hover { background: var(--bg-card-hover); }

.report-icon {
  width: 44px; height: 44px; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.report-icon--red { background: rgba(220,38,38,0.1); color: var(--accent-secondary); border: 1px solid rgba(220,38,38,0.2); }
.report-icon--amber { background: rgba(245,158,11,0.1); color: var(--accent-amber); border: 1px solid rgba(245,158,11,0.2); }
.report-icon--blue { background: rgba(59,130,246,0.1); color: var(--accent-blue); border: 1px solid rgba(59,130,246,0.2); }
.report-icon--green { background: var(--accent-green-glow); color: var(--accent-green); border: 1px solid rgba(34,197,94,0.2); }
.report-icon--cyan { background: rgba(6,182,212,0.1); color: #06b6d4; border: 1px solid rgba(6,182,212,0.2); }
.report-icon--orange { background: rgba(249,115,22,0.1); color: var(--accent-orange); border: 1px solid rgba(249,115,22,0.2); }

.report-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.report-name { font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }
.report-desc { font-family: var(--font-body); font-size: 0.75rem; color: var(--text-secondary); }

.report-actions { display: flex; gap: 6px; }
.report-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 10px; border-radius: var(--radius);
  border: 1px solid var(--border-subtle); background: var(--bg-secondary);
  color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.65rem;
  letter-spacing: 0.06em; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.report-btn:hover { border-color: var(--border-accent); color: var(--accent-secondary); }

/* Sys stats */
.sys-stats { padding: 16px; display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid var(--border-subtle); }
.sys-stat { display: flex; flex-direction: column; gap: 5px; }
.sys-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.sys-bar-wrap { display: flex; align-items: center; gap: 8px; }
.sys-bar { flex: 1; height: 6px; background: var(--bg-secondary); border-radius: 3px; overflow: hidden; }
.sys-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
.sys-fill--green { background: var(--accent-green); }
.sys-fill--blue { background: var(--accent-blue); }
.sys-fill--orange { background: var(--accent-orange); }
.sys-val { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.05em; width: 32px; text-align: right; }
.sys-val--green { color: var(--accent-green); }
.sys-val--blue { color: var(--accent-blue); }
.sys-val--orange { color: var(--accent-orange); }

.sys-info-rows { display: flex; flex-direction: column; gap: 0; overflow-y: auto; flex: 1; padding: 8px 0; }
.sys-info-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 16px; border-bottom: 1px solid var(--border-subtle); transition: background 0.2s;
}
.sys-info-row:last-child { border-bottom: none; }
.sys-info-row:hover { background: var(--bg-card-hover); }
.si-label { font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; }
.si-value { font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-secondary); letter-spacing: 0.05em; }
.si-value--accent { color: var(--accent-green); }

/* Recent exports */
.recent-section {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); flex-shrink: 0; max-height: 200px; overflow: hidden;
  display: flex; flex-direction: column;
}

.recent-list { overflow-y: auto; flex: 1; }
.recent-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 16px; border-bottom: 1px solid var(--border-subtle);
  transition: background 0.2s;
}
.recent-item:last-child { border-bottom: none; }
.recent-item:hover { background: var(--bg-card-hover); }

.recent-icon {
  width: 32px; height: 32px; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
}
.recent-icon--csv { background: rgba(34,197,94,0.1); color: var(--accent-green); }
.recent-icon--pdf { background: rgba(239,68,68,0.1); color: var(--accent-red); }

.recent-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.recent-name { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-primary); }
.recent-date { font-family: var(--font-mono); font-size: 0.58rem; color: var(--text-muted); }
.recent-size { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); }

.recent-download {
  width: 28px; height: 28px; border-radius: var(--radius);
  border: 1px solid var(--border-subtle); background: var(--bg-secondary);
  color: var(--text-muted); cursor: pointer; display: flex;
  align-items: center; justify-content: center; transition: all 0.2s;
}
.recent-download:hover { border-color: var(--accent-secondary); color: var(--accent-secondary); }
</style>
