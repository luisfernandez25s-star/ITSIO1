<template>
  <div class="login">
    <!-- Left brand panel -->
    <aside class="login-aside">
      <div class="aside-content">
        <div class="brand-emblem">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
            <path d="M16 3L6 8v8c0 5.55 4.27 10.74 10 12 5.73-1.26 10-6.45 10-12V8L16 3z" fill="rgba(220,38,38,0.15)" stroke="#dc2626" stroke-width="1.5"/>
            <path d="M13 17l-3-3 1.4-1.4 1.6 1.6 4.6-4.6L19 11l-6 6z" fill="#dc2626"/>
          </svg>
        </div>
        <h1 class="aside-brand">ITSIO</h1>
        <span class="aside-sub">GESTIÓN OPERATIVA · BOMBEROS</span>
        <p class="aside-desc">
          Sistema de control operativo para la gestión de flota, estado de fuerza y despacho de unidades.
        </p>
        <div class="aside-indicator">
          <span class="pulse-dot"></span>
          <span>SISTEMA EN LÍNEA</span>
        </div>
      </div>
      <span class="aside-footer">// ACCESO RESTRINGIDO · PERSONAL AUTORIZADO</span>
    </aside>

    <!-- Right form panel -->
    <main class="login-main">
      <!-- ============ MODO: LOGIN ============ -->
      <div v-if="mode === 'login'" class="login-card">
        <span class="section-tag">// INICIAR SESIÓN</span>
        <h2 class="login-title">Bienvenido de vuelta</h2>
        <p class="login-hint">Ingresa con tu ID de empleado y contraseña.</p>

        <form class="login-form" @submit.prevent="handleSubmit">
          <div class="field">
            <label for="employeeId">ID de Empleado</label>
            <div class="input-wrap" :class="{ 'input-wrap--error': fieldErrors.employeeId }">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input
                id="employeeId"
                v-model.trim="employeeId"
                type="text"
                inputmode="numeric"
                autocomplete="username"
                placeholder="Ej. 24-01"
              >
            </div>
            <span v-if="fieldErrors.employeeId" class="field-error">{{ fieldErrors.employeeId }}</span>
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <div class="input-wrap" :class="{ 'input-wrap--error': fieldErrors.password }">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
              >
              <button type="button" class="toggle-pass" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
          </div>

          <div class="form-row">
            <label class="remember">
              <input type="checkbox" v-model="remember">
              <span>Recordarme</span>
            </label>
            <a href="#" class="forgot" @click.prevent="openForgot">¿Olvidaste tu contraseña?</a>
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else>Verificando...</span>
          </button>
        </form>

        <div class="divider-row">
          <span class="line"></span>
          <span class="divider-text">O CONTINÚA CON</span>
          <span class="line"></span>
        </div>

        <button type="button" class="btn-google" @click="handleGoogle" :disabled="loading">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Iniciar sesión con Google
        </button>

        <p class="login-footer">
          ¿Problemas para acceder? Contacta al administrador del sistema.
        </p>

        <!-- Aviso de demo: credenciales de prueba para ver cada rango -->
        <div class="demo-creds">
          <div class="demo-creds-head">
            <span class="demo-note-tag">DEMO</span>
            <span>Cuentas de prueba (cada rango ve un menú distinto)</span>
          </div>
          <ul>
            <li v-for="acc in demoCredentials" :key="acc.id">
              <button type="button" class="demo-fill" @click="fillDemo(acc)">
                <span class="demo-role" :data-role="acc.roleKey">{{ acc.role }}</span>
                <code>{{ acc.id }} · {{ acc.pass }}</code>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- ============ MODO: RECUPERAR (email → código → nueva contraseña) ============ -->
      <div v-else class="login-card">
        <button type="button" class="back-link" @click="backToLogin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Volver al inicio de sesión
        </button>

        <!-- Paso 1: correo -->
        <template v-if="mode === 'forgot-email'">
          <span class="section-tag">// RECUPERAR ACCESO · PASO 1 DE 3</span>
          <h2 class="login-title">Recuperar contraseña</h2>
          <p class="login-hint">Ingresa tu correo y te enviaremos un código de verificación.</p>

          <form class="login-form" @submit.prevent="handleSendCode">
            <div class="field">
              <label for="recoveryEmail">Correo electrónico</label>
              <div class="input-wrap" :class="{ 'input-wrap--error': fieldErrors.email }">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input id="recoveryEmail" v-model.trim="email" type="email" autocomplete="email" placeholder="nombre@gmail.com">
              </div>
              <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
            </div>

            <p v-if="error" class="error-msg">{{ error }}</p>

            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="!loading">Enviar código</span>
              <span v-else>Enviando...</span>
            </button>
          </form>
        </template>

        <!-- Paso 2: código -->
        <template v-else-if="mode === 'forgot-code'">
          <span class="section-tag">// RECUPERAR ACCESO · PASO 2 DE 3</span>
          <h2 class="login-title">Verifica tu correo</h2>
          <p class="login-hint">Enviamos un código de 6 dígitos a <strong>{{ email }}</strong>.</p>

          <!-- Aviso de demo: muestra el codigo generado (el backend NO hara esto) -->
          <div class="demo-note">
            <span class="demo-note-tag">DEMO</span>
            Código simulado: <strong>{{ demoCode }}</strong>
            <small>El backend enviará este código por correo y no lo mostrará aquí.</small>
          </div>

          <form class="login-form" @submit.prevent="handleVerifyCode">
            <div class="field">
              <label for="code">Código de verificación</label>
              <div class="input-wrap code-input" :class="{ 'input-wrap--error': fieldErrors.code }">
                <input id="code" v-model.trim="code" type="text" inputmode="numeric" maxlength="6" placeholder="000000">
              </div>
              <span v-if="fieldErrors.code" class="field-error">{{ fieldErrors.code }}</span>
            </div>

            <p v-if="error" class="error-msg">{{ error }}</p>

            <button type="submit" class="btn-primary" :disabled="loading">Verificar código</button>
            <button type="button" class="btn-ghost" @click="handleSendCode">Reenviar código</button>
          </form>
        </template>

        <!-- Paso 3: nueva contraseña -->
        <template v-else-if="mode === 'forgot-reset'">
          <span class="section-tag">// RECUPERAR ACCESO · PASO 3 DE 3</span>
          <h2 class="login-title">Nueva contraseña</h2>
          <p class="login-hint">Crea una contraseña segura para tu cuenta.</p>

          <form class="login-form" @submit.prevent="handleResetPassword">
            <div class="field">
              <label for="newPass">Nueva contraseña</label>
              <div class="input-wrap" :class="{ 'input-wrap--error': fieldErrors.newPass }">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input id="newPass" v-model="newPass" :type="showPassword ? 'text' : 'password'" placeholder="••••••••">
                <button type="button" class="toggle-pass" @click="showPassword = !showPassword">
                  <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <!-- Requisitos de contraseña -->
            <div class="pw-requirements">
              <div class="pw-strength">
                <span v-for="n in 4" :key="n" class="pw-strength-seg" :class="{ active: strength >= n }" :data-level="strength"></span>
              </div>
              <ul class="pw-checklist">
                <li v-for="rule in passwordRules" :key="rule.key" :class="{ ok: pwChecks[rule.key] }">
                  {{ rule.label }}
                </li>
              </ul>
            </div>

            <div class="field">
              <label for="confirmPass">Confirmar contraseña</label>
              <div class="input-wrap" :class="{ 'input-wrap--error': fieldErrors.confirmPass }">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input id="confirmPass" v-model="confirmPass" :type="showPassword ? 'text' : 'password'" placeholder="••••••••">
              </div>
              <span v-if="fieldErrors.confirmPass" class="field-error">{{ fieldErrors.confirmPass }}</span>
            </div>

            <p v-if="error" class="error-msg">{{ error }}</p>

            <button type="submit" class="btn-primary" :disabled="loading">Cambiar contraseña</button>
          </form>
        </template>

        <!-- Paso final: éxito -->
        <template v-else-if="mode === 'forgot-done'">
          <div class="success-block">
            <div class="success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 class="login-title">Contraseña actualizada</h2>
            <p class="login-hint">Tu contraseña se cambió correctamente. Ya puedes iniciar sesión.</p>
            <button type="button" class="btn-primary" @click="backToLogin">Ir al inicio de sesión</button>
          </div>
        </template>
      </div>
    </main>

    <!-- ============ MODAL: SELECTOR DE CUENTA DE GOOGLE ============ -->
    <transition name="fade">
      <div v-if="showGoogle" class="g-overlay" @click.self="closeGoogle">
        <div class="g-modal" role="dialog" aria-modal="true">
          <button type="button" class="g-close" @click="closeGoogle" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="g-head">
            <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            <h3 class="g-title">Elige una cuenta</h3>
            <p class="g-sub">para continuar a <strong>ITSIO</strong></p>
          </div>

          <!-- Lista de cuentas -->
          <ul v-if="!googleDenied" class="g-accounts">
            <li v-for="acc in googleAccounts" :key="acc.email">
              <button type="button" class="g-account" :disabled="loading" @click="selectGoogleAccount(acc)">
                <span class="g-avatar" :class="{ 'g-avatar--personal': acc.email === 'visitante@gmail.com' }">{{ acc.avatar }}</span>
                <span class="g-account-info">
                  <span class="g-account-name">{{ acc.name }}</span>
                  <span class="g-account-email">{{ acc.email }}</span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" class="g-account g-account--other" disabled>
                <span class="g-avatar g-avatar--add">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                </span>
                <span class="g-account-info">
                  <span class="g-account-name">Usar otra cuenta</span>
                </span>
              </button>
            </li>
          </ul>

          <!-- Acceso denegado -->
          <div v-else class="g-denied">
            <div class="g-denied-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h4>Acceso denegado</h4>
            <p>
              La cuenta <strong>{{ deniedEmail }}</strong> no está autorizada.
              Solo el personal dado de alta por el administrador puede ingresar.
            </p>
            <div class="g-denied-actions">
              <button type="button" class="btn-ghost" @click="googleDenied = false">Elegir otra cuenta</button>
              <button type="button" class="btn-primary" @click="closeGoogle">Entendido</button>
            </div>
          </div>

          <p class="g-legal">Solo frontend · el backend integrará el OAuth real de Google.</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { validatePassword, passwordStrength, sendRecoveryCode, verifyRecoveryCode, clearRecovery, PASSWORD_RULES } from '@/utils/authMock.js'
import { findByEmployeeId, findByGoogle, loginUser, GOOGLE_ACCOUNTS } from '@/utils/usersMock.js'

export default {
  name: 'LoginView',
  data() {
    return {
      // login
      employeeId: '',
      password: '',
      showPassword: false,
      remember: true,
      loading: false,
      error: '',
      fieldErrors: {},
      // recuperacion
      mode: 'login', // login | forgot-email | forgot-code | forgot-reset | forgot-done
      email: '',
      code: '',
      demoCode: '',
      newPass: '',
      confirmPass: '',
      // reglas de contraseña (para el checklist)
      passwordRules: PASSWORD_RULES,
      // google
      showGoogle: false,
      googleAccounts: GOOGLE_ACCOUNTS,
      googleDenied: false,
      deniedEmail: '',
      // credenciales demo (solo para pruebas visuales)
      demoCredentials: [
        { id: '24-01', pass: 'Admin#2024!', role: 'Administrador', roleKey: 'admin' },
        { id: '24-02', pass: 'Coma#2024x!', role: 'Comandante', roleKey: 'comandante' },
        { id: '24-03', pass: 'Ofic#2024y!', role: 'Oficial', roleKey: 'oficial' },
        { id: '24-04', pass: 'Bomb#2024z!', role: 'Bombero', roleKey: 'bombero' },
      ],
    }
  },
  computed: {
    pwChecks() {
      return validatePassword(this.newPass).checks
    },
    strength() {
      return passwordStrength(this.newPass)
    },
  },
  methods: {
    resetMessages() {
      this.error = ''
      this.fieldErrors = {}
    },
    // ---- LOGIN CON ID + CONTRASEÑA ----
    handleSubmit() {
      this.resetMessages()
      const errors = {}
      if (!this.employeeId) errors.employeeId = 'Ingresa tu ID de empleado.'
      if (!this.password) errors.password = 'Ingresa tu contraseña.'
      if (Object.keys(errors).length) {
        this.fieldErrors = errors
        return
      }
      this.loading = true
      // Simula la verificación contra el directorio de empleados.
      // Backend real: validar credenciales y devolver el rol del usuario.
      setTimeout(() => {
        const emp = findByEmployeeId(this.employeeId)
        if (!emp || emp.password !== this.password) {
          this.loading = false
          this.error = 'ID de empleado o contraseña incorrectos.'
          return
        }
        // Guarda la sesión con el rango del empleado -> vista según su rango.
        loginUser(emp, 'password')
        this.loading = false
        this.$router.push('/')
      }, 700)
    },

    // ---- LOGIN CON GOOGLE ----
    // 1) Abre el selector de cuenta.
    handleGoogle() {
      this.resetMessages()
      this.googleDenied = false
      this.deniedEmail = ''
      this.showGoogle = true
    },
    closeGoogle() {
      this.showGoogle = false
      this.googleDenied = false
      this.loading = false
    },
    // 2) Al elegir una cuenta, se valida si tiene permiso (dada de alta).
    selectGoogleAccount(acc) {
      this.loading = true
      setTimeout(() => {
        const emp = findByGoogle(acc.email)
        if (!emp) {
          // La cuenta no está autorizada por el admin.
          this.deniedEmail = acc.email
          this.googleDenied = true
          this.loading = false
          return
        }
        loginUser(emp, 'google')
        this.loading = false
        this.showGoogle = false
        this.$router.push('/')
      }, 800)
    },

    // Rellena el formulario con una cuenta demo.
    fillDemo(acc) {
      this.resetMessages()
      this.employeeId = acc.id
      this.password = acc.pass
    },
    // ---- RECUPERACION ----
    openForgot() {
      this.resetMessages()
      this.mode = 'forgot-email'
    },
    backToLogin() {
      this.resetMessages()
      this.mode = 'login'
      this.code = ''
      this.newPass = ''
      this.confirmPass = ''
    },
    handleSendCode() {
      this.resetMessages()
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
      if (!emailOk) {
        this.fieldErrors = { email: 'Ingresa un correo válido.' }
        return
      }
      this.loading = true
      setTimeout(() => {
        // Backend real: enviar correo con el codigo. Aqui lo generamos localmente.
        this.demoCode = sendRecoveryCode(this.email)
        this.loading = false
        this.mode = 'forgot-code'
      }, 700)
    },
    handleVerifyCode() {
      this.resetMessages()
      if (!/^\d{6}$/.test(this.code)) {
        this.fieldErrors = { code: 'El código debe tener 6 dígitos.' }
        return
      }
      const res = verifyRecoveryCode(this.code)
      if (!res.ok) {
        this.error = res.reason
        return
      }
      this.mode = 'forgot-reset'
    },
    handleResetPassword() {
      this.resetMessages()
      const { valid } = validatePassword(this.newPass)
      const errors = {}
      if (!valid) errors.newPass = 'La contraseña no cumple los requisitos.'
      if (this.newPass !== this.confirmPass) errors.confirmPass = 'Las contraseñas no coinciden.'
      if (Object.keys(errors).length) {
        this.fieldErrors = errors
        if (errors.newPass) this.error = errors.newPass
        return
      }
      this.loading = true
      setTimeout(() => {
        // Backend real: actualizar la contraseña del usuario.
        clearRecovery()
        this.loading = false
        this.mode = 'forgot-done'
      }, 700)
    },
  },
}
</script>

<style scoped>
.login {
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg-primary);
  overflow-y: auto;
}

/* ---- Aside (brand) ---- */
.login-aside {
  position: relative;
  background: var(--bg-nav);
  border-right: 1px solid rgba(220,38,38,0.2);
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.login-aside::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, var(--accent-glow), transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(245,158,11,0.08), transparent 45%);
  pointer-events: none;
}
.aside-content { position: relative; max-width: 420px; }
.brand-emblem { margin-bottom: 20px; }
.aside-brand {
  font-family: var(--font-display);
  font-size: 3rem; font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.18em;
  margin: 0;
}
.aside-sub {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.24em;
  text-transform: uppercase;
}
.aside-desc {
  font-family: var(--font-body);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 24px;
  font-size: 0.95rem;
  max-width: 360px;
}
.aside-indicator {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 28px;
  padding: 6px 14px;
  border-radius: 3px;
  background: rgba(34,197,94,0.07);
  border: 1px solid rgba(34,197,94,0.18);
  color: var(--accent-green);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.18em;
}
.pulse-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent-green);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
.aside-footer {
  position: absolute;
  bottom: 24px; left: 48px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--accent-secondary);
  letter-spacing: 0.2em;
}

/* ---- Main (form) ---- */
.login-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}
.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 36px 32px;
  box-shadow: var(--shadow-card);
}
.login-title {
  font-family: var(--font-display);
  font-size: 1.7rem; font-weight: 700;
  color: var(--text-primary);
  margin: 6px 0 4px;
  letter-spacing: 0.03em;
}
.login-hint {
  font-family: var(--font-body);
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0 0 24px;
}
.login-hint strong { color: var(--text-secondary); }

.login-form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-secondary);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.input-wrap {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 0 12px;
  transition: border-color 0.2s;
}
.input-wrap:focus-within { border-color: var(--border-accent); }
.input-wrap--error { border-color: var(--accent-red); }
.input-icon { color: var(--text-muted); flex-shrink: 0; }
.input-wrap input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  padding: 11px 0;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-primary);
}
.input-wrap input::placeholder { color: var(--text-muted); opacity: 0.7; }
.code-input input {
  text-align: center;
  letter-spacing: 0.5em;
  font-family: var(--font-mono);
  font-size: 1.2rem;
}
.toggle-pass {
  background: none; border: none; cursor: pointer;
  color: var(--text-muted); display: flex; padding: 0;
  transition: color 0.2s;
}
.toggle-pass:hover { color: var(--accent-secondary); }

.field-error {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--accent-red);
}

.form-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 0.78rem;
}
.remember {
  display: flex; align-items: center; gap: 7px;
  color: var(--text-secondary);
  font-family: var(--font-body);
  cursor: pointer;
}
.remember input { accent-color: var(--accent-primary); width: 15px; height: 15px; }
.forgot {
  color: var(--accent-secondary);
  text-decoration: none;
  font-family: var(--font-body);
  cursor: pointer;
}
.forgot:hover { text-decoration: underline; }

.error-msg {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--accent-red);
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: var(--radius);
  padding: 8px 12px;
}

/* Aviso demo */
.demo-note {
  display: flex; flex-direction: column; gap: 2px;
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: var(--text-secondary);
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.25);
  border-radius: var(--radius);
  padding: 10px 12px;
  margin-bottom: 18px;
}
.demo-note strong { color: var(--accent-amber); font-family: var(--font-mono); letter-spacing: 0.15em; }
.demo-note small { color: var(--text-muted); font-size: 0.68rem; }
.demo-note-tag {
  align-self: flex-start;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.18em;
  color: var(--accent-amber);
  border: 1px solid rgba(245,158,11,0.35);
  border-radius: 3px;
  padding: 1px 6px;
  margin-bottom: 2px;
}

/* Requisitos de contraseña */
.pw-requirements { display: flex; flex-direction: column; gap: 10px; }
.pw-strength { display: flex; gap: 5px; }
.pw-strength-seg {
  flex: 1; height: 4px; border-radius: 2px;
  background: var(--border-subtle);
  transition: background 0.2s;
}
.pw-strength-seg.active[data-level="1"] { background: var(--accent-red); }
.pw-strength-seg.active[data-level="2"] { background: var(--accent-orange); }
.pw-strength-seg.active[data-level="3"] { background: var(--accent-amber); }
.pw-strength-seg.active[data-level="4"] { background: var(--accent-green); }
.pw-checklist {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px;
}
.pw-checklist li {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  position: relative;
  padding-left: 16px;
}
.pw-checklist li::before {
  content: '○';
  position: absolute; left: 0;
  color: var(--text-muted);
}
.pw-checklist li.ok { color: var(--accent-green); }
.pw-checklist li.ok::before { content: '✓'; color: var(--accent-green); }

.btn-primary {
  margin-top: 4px;
  padding: 12px;
  border: none;
  border-radius: var(--radius);
  background: var(--accent-primary);
  color: #fff;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}
.btn-primary:hover:not(:disabled) { background: var(--accent-secondary); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-ghost {
  padding: 10px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  background: none;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 0.82rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-ghost:hover { border-color: var(--border-accent); color: var(--text-primary); }

.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.78rem;
  padding: 0; margin-bottom: 20px;
  transition: color 0.2s;
}
.back-link:hover { color: var(--accent-secondary); }

.success-block {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 8px; padding: 12px 0;
}
.success-icon {
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.3);
  color: var(--accent-green);
  margin-bottom: 8px;
}
.success-block .btn-primary { width: 100%; margin-top: 16px; }

.divider-row {
  display: flex; align-items: center; gap: 12px;
  margin: 22px 0;
}
.divider-row .line { flex: 1; height: 1px; background: var(--border-subtle); }
.divider-text {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
  letter-spacing: 0.16em;
}

.btn-google {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 11px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.btn-google:hover:not(:disabled) { border-color: var(--border-accent); background: var(--bg-card-hover); }
.btn-google:disabled { opacity: 0.6; cursor: not-allowed; }

.login-footer {
  margin: 22px 0 0;
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* ---- Credenciales demo ---- */
.demo-creds {
  margin-top: 18px;
  padding: 14px;
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius);
  background: var(--bg-secondary);
}
.demo-creds-head {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}
.demo-creds ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
.demo-fill {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 7px 10px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.demo-fill:hover { border-color: var(--border-accent); background: var(--bg-card-hover); }
.demo-fill code {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-secondary);
}
.demo-role {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 3px;
  flex-shrink: 0;
}
.demo-role[data-role="admin"]      { color: var(--accent-red);    background: rgba(220,38,38,0.12); }
.demo-role[data-role="comandante"] { color: var(--accent-orange); background: rgba(245,158,11,0.12); }
.demo-role[data-role="oficial"]    { color: var(--accent-amber);  background: rgba(234,179,8,0.12); }
.demo-role[data-role="bombero"]    { color: var(--accent-green);  background: rgba(34,197,94,0.12); }

/* ---- Modal selector de Google ---- */
.g-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.72);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  z-index: 2000;
}
.g-modal {
  position: relative;
  width: 100%; max-width: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 28px 24px 18px;
  box-shadow: var(--shadow-card);
}
.g-close {
  position: absolute; top: 14px; right: 14px;
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer;
  color: var(--text-muted);
  border-radius: var(--radius);
  transition: color 0.2s, background 0.2s;
}
.g-close:hover { color: var(--text-primary); background: var(--bg-secondary); }
.g-head { text-align: center; margin-bottom: 18px; }
.g-title {
  font-family: var(--font-display);
  font-size: 1.25rem; font-weight: 700;
  color: var(--text-primary);
  margin: 10px 0 2px;
}
.g-sub { font-size: 0.82rem; color: var(--text-muted); margin: 0; }
.g-sub strong { color: var(--text-secondary); }

.g-accounts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.g-account {
  width: 100%;
  display: flex; align-items: center; gap: 12px;
  padding: 11px 8px;
  background: none; border: none;
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer; text-align: left;
  transition: background 0.2s;
}
.g-account:hover:not(:disabled) { background: var(--bg-secondary); }
.g-account:disabled { cursor: not-allowed; opacity: 0.7; }
.g-account--other { border-bottom: none; }
.g-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--accent-primary);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700; font-size: 0.78rem;
  flex-shrink: 0;
}
.g-avatar--personal { background: var(--text-muted); }
.g-avatar--add { background: var(--bg-secondary); color: var(--text-muted); border: 1px solid var(--border-subtle); }
.g-account-info { display: flex; flex-direction: column; line-height: 1.3; }
.g-account-name { font-size: 0.88rem; color: var(--text-primary); font-weight: 600; }
.g-account-email { font-size: 0.75rem; color: var(--text-muted); }

/* Acceso denegado */
.g-denied { text-align: center; padding: 8px 4px 4px; }
.g-denied-icon {
  width: 52px; height: 52px; margin: 0 auto 12px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(220,38,38,0.1);
  border: 1px solid rgba(220,38,38,0.3);
  color: var(--accent-red);
}
.g-denied h4 {
  font-family: var(--font-display);
  color: var(--text-primary);
  margin: 0 0 6px; font-size: 1.05rem;
}
.g-denied p { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin: 0 0 16px; }
.g-denied p strong { color: var(--accent-secondary); }
.g-denied-actions { display: flex; gap: 10px; }
.g-denied-actions .btn-ghost,
.g-denied-actions .btn-primary { flex: 1; margin-top: 0; }

.g-legal {
  margin: 16px 0 0;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

/* Transición modal */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ---- Responsive ---- */
@media (max-width: 860px) {
  .login { grid-template-columns: 1fr; }
  .login-aside { display: none; }
  .login-main { padding: 20px; }
}
</style>
