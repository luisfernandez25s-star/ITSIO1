<template>
  <div class="profile">
    <!-- Header -->
    <header class="profile-header">
      <div class="ph-left">
        <div class="ph-avatar">{{ initials }}</div>
        <div>
          <h1 class="ph-name">{{ user.name }}</h1>
          <p class="ph-role">{{ user.role }} · ID {{ user.employeeId }}</p>
        </div>
      </div>
      <span class="ph-status">
        <span class="dot"></span> EN SERVICIO
      </span>
    </header>

    <div class="profile-grid">
      <!-- Datos del empleado -->
      <section class="card">
        <h2 class="card-title">Datos del empleado</h2>
        <ul class="data-list">
          <li><span>Nombre completo</span><strong>{{ user.name }}</strong></li>
          <li><span>ID de empleado</span><strong>{{ user.employeeId }}</strong></li>
          <li><span>Rango</span><strong>{{ user.role }}</strong></li>
          <li><span>Correo</span><strong>{{ user.email }}</strong></li>
          <li><span>Estación</span><strong>{{ user.station }}</strong></li>
          <li><span>Guardia</span><strong>{{ user.shift }}</strong></li>
        </ul>
      </section>

      <!-- Cambio de contraseña por codigo -->
      <section class="card">
        <h2 class="card-title">Seguridad · Cambiar contraseña</h2>

        <!-- Paso 1: solicitar codigo -->
        <template v-if="step === 'request'">
          <p class="card-desc">
            Enviaremos un código de verificación de 6 dígitos a tu correo
            <strong>{{ user.email }}</strong> para autorizar el cambio de contraseña.
          </p>
          <button class="btn-primary" :disabled="loading" @click="requestCode">
            <span v-if="!loading">Enviar código a mi correo</span>
            <span v-else>Enviando…</span>
          </button>
        </template>

        <!-- Paso 2: verificar codigo -->
        <template v-else-if="step === 'verify'">
          <div class="alert alert-info">
            Código enviado a <strong>{{ user.email }}</strong>.
            <span class="demo-code">Demo: {{ demoCode }}</span>
          </div>
          <label class="field-label">Código de verificación</label>
          <input
            v-model="codeInput"
            class="input code-input"
            inputmode="numeric"
            maxlength="6"
            placeholder="______"
            @input="codeInput = codeInput.replace(/[^0-9]/g, '')"
          />
          <p v-if="error" class="msg-error">{{ error }}</p>
          <div class="row-actions">
            <button class="btn-primary" :disabled="codeInput.length !== 6" @click="checkCode">
              Verificar código
            </button>
            <button class="btn-ghost" @click="resetFlow">Cancelar</button>
          </div>
        </template>

        <!-- Paso 3: nueva contraseña -->
        <template v-else-if="step === 'reset'">
          <div class="alert alert-ok">Código verificado. Define tu nueva contraseña.</div>

          <label class="field-label">Nueva contraseña</label>
          <input v-model="newPassword" type="password" class="input" placeholder="••••••••" />

          <!-- Requisitos -->
          <ul class="req-list">
            <li :class="{ met: pwChecks.length }">Mínimo 8 caracteres</li>
            <li :class="{ met: pwChecks.upper }">Una letra mayúscula</li>
            <li :class="{ met: pwChecks.lower }">Una letra minúscula</li>
            <li :class="{ met: pwChecks.number }">Un número</li>
          </ul>

          <!-- Barra de fortaleza -->
          <div class="strength">
            <div class="strength-bar">
              <span v-for="n in 4" :key="n" :class="['seg', { on: strength >= n }]" :data-lvl="strength"></span>
            </div>
            <span class="strength-label" :data-lvl="strength">{{ strengthLabel }}</span>
          </div>

          <label class="field-label">Confirmar contraseña</label>
          <input v-model="confirmPassword" type="password" class="input" placeholder="••••••••" />
          <p v-if="confirmPassword && confirmPassword !== newPassword" class="msg-error">
            Las contraseñas no coinciden.
          </p>

          <p v-if="error" class="msg-error">{{ error }}</p>

          <div class="row-actions">
            <button class="btn-primary" :disabled="!canSave" @click="savePassword">
              Guardar contraseña
            </button>
            <button class="btn-ghost" @click="resetFlow">Cancelar</button>
          </div>
        </template>

        <!-- Paso 4: exito -->
        <template v-else-if="step === 'done'">
          <div class="success-block">
            <div class="success-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>Contraseña actualizada</h3>
            <p>Tu contraseña se cambió correctamente.</p>
            <button class="btn-ghost" @click="resetFlow">Listo</button>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script>
import {
  validatePassword,
  passwordStrength,
  sendRecoveryCode,
  verifyRecoveryCode,
  clearRecovery,
} from '@/utils/authMock'

export default {
  name: 'ProfileView',
  data() {
    return {
      user: {
        name: 'Cmdt. Alejandro Ríos',
        employeeId: '',
        role: 'Comandante de Estación',
        email: 'a.rios@itsio.gob.mx',
        station: 'Estación Central 01',
        shift: 'Guardia A',
      },
      step: 'request', // request | verify | reset | done
      loading: false,
      demoCode: '',
      codeInput: '',
      newPassword: '',
      confirmPassword: '',
      error: '',
    }
  },
  created() {
    // Carga el usuario guardado en el login (solo frontend).
    try {
      const raw = localStorage.getItem('itsio-user')
      if (raw) {
        const saved = JSON.parse(raw)
        this.user.employeeId = saved.employeeId || '00000'
        if (saved.email) this.user.email = saved.email
      } else {
        this.user.employeeId = '00000'
      }
    } catch {
      this.user.employeeId = '00000'
    }
  },
  computed: {
    initials() {
      return this.user.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
    },
    pwChecks() {
      return validatePassword(this.newPassword).checks
    },
    strength() {
      return passwordStrength(this.newPassword)
    },
    strengthLabel() {
      return ['Muy débil', 'Débil', 'Media', 'Buena', 'Fuerte'][this.strength]
    },
    canSave() {
      return (
        validatePassword(this.newPassword).valid &&
        this.newPassword === this.confirmPassword
      )
    },
  },
  methods: {
    requestCode() {
      this.error = ''
      this.loading = true
      // Simula la latencia del envio de correo.
      setTimeout(() => {
        this.demoCode = sendRecoveryCode(this.user.email)
        this.loading = false
        this.step = 'verify'
      }, 900)
    },
    checkCode() {
      const result = verifyRecoveryCode(this.codeInput)
      if (!result.ok) {
        this.error = result.reason
        return
      }
      this.error = ''
      this.step = 'reset'
    },
    savePassword() {
      if (!this.canSave) return
      // Backend real: enviar la nueva contraseña + codigo verificado a la API.
      clearRecovery()
      this.step = 'done'
    },
    resetFlow() {
      this.step = 'request'
      this.loading = false
      this.demoCode = ''
      this.codeInput = ''
      this.newPassword = ''
      this.confirmPassword = ''
      this.error = ''
    },
  },
}
</script>

<style scoped>
.profile {
  padding: 28px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

/* Header */
.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-subtle);
  flex-wrap: wrap;
}
.ph-left { display: flex; align-items: center; gap: 16px; }
.ph-avatar {
  width: 56px; height: 56px;
  border-radius: var(--radius);
  background: var(--accent-primary);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
}
.ph-name {
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: var(--text-primary);
  margin: 0;
}
.ph-role {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 4px 0 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.ph-status {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: #16a34a;
  border: 1px solid rgba(22,163,74,0.3);
  background: rgba(22,163,74,0.08);
  padding: 6px 12px;
  border-radius: var(--radius);
}
.ph-status .dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #16a34a;
  box-shadow: 0 0 8px rgba(22,163,74,0.7);
}

/* Grid */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 900px) {
  .profile-grid { grid-template-columns: 1fr 1.15fr; align-items: start; }
}

/* Cards */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 22px;
}
.card-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--text-primary);
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.card-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 18px;
}
.card-desc strong { color: var(--text-primary); }

/* Data list */
.data-list { list-style: none; margin: 0; padding: 0; }
.data-list li {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border-subtle);
}
.data-list li:last-child { border-bottom: none; }
.data-list span {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.data-list strong { color: var(--text-primary); font-size: 0.9rem; font-weight: 600; text-align: right; }

/* Inputs */
.field-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 14px 0 6px;
}
.input {
  width: 100%;
  background: var(--bg-app, #0f0f10);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 11px 13px;
  color: var(--text-primary);
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.2s;
}
.input:focus { border-color: var(--accent-primary); }
.code-input {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  letter-spacing: 0.5em;
  text-align: center;
}

/* Buttons */
.btn-primary {
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 11px 18px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 11px 18px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover { color: var(--text-primary); border-color: var(--border-accent); }
.row-actions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }

/* Alerts */
.alert {
  border-radius: var(--radius);
  padding: 12px 14px;
  font-size: 0.85rem;
  margin-bottom: 8px;
}
.alert-info {
  background: rgba(220,38,38,0.06);
  border: 1px solid rgba(220,38,38,0.2);
  color: var(--text-secondary);
}
.alert-ok {
  background: rgba(22,163,74,0.08);
  border: 1px solid rgba(22,163,74,0.3);
  color: #16a34a;
}
.demo-code {
  display: block;
  margin-top: 6px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--accent-secondary);
  letter-spacing: 0.1em;
}

/* Requirements */
.req-list { list-style: none; margin: 12px 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; }
.req-list li {
  position: relative;
  padding-left: 20px;
  font-size: 0.78rem;
  color: var(--text-muted);
  transition: color 0.2s;
}
.req-list li::before {
  content: '○';
  position: absolute; left: 0;
  color: var(--text-muted);
}
.req-list li.met { color: #16a34a; }
.req-list li.met::before { content: '●'; color: #16a34a; }

/* Strength */
.strength { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
.strength-bar { display: flex; gap: 4px; flex: 1; }
.seg { height: 5px; flex: 1; border-radius: 3px; background: var(--border-subtle); transition: background 0.2s; }
.seg.on[data-lvl="1"] { background: #dc2626; }
.seg.on[data-lvl="2"] { background: #f59e0b; }
.seg.on[data-lvl="3"] { background: #eab308; }
.seg.on[data-lvl="4"] { background: #16a34a; }
.strength-label { font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.06em; min-width: 66px; text-align: right; color: var(--text-muted); }
.strength-label[data-lvl="1"] { color: #dc2626; }
.strength-label[data-lvl="2"] { color: #f59e0b; }
.strength-label[data-lvl="3"] { color: #eab308; }
.strength-label[data-lvl="4"] { color: #16a34a; }

.msg-error { color: #f87171; font-size: 0.8rem; margin: 8px 0 0; }

/* Success */
.success-block { text-align: center; padding: 20px 0; }
.success-icon {
  width: 54px; height: 54px; margin: 0 auto 14px;
  border-radius: 50%;
  background: rgba(22,163,74,0.12);
  color: #16a34a;
  display: flex; align-items: center; justify-content: center;
}
.success-block h3 { font-family: var(--font-display); color: var(--text-primary); margin: 0 0 6px; }
.success-block p { color: var(--text-secondary); font-size: 0.88rem; margin: 0 0 18px; }
</style>
