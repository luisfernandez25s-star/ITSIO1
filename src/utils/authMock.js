// =============================================================
// authMock.js  ·  SOLO FRONTEND (mock)
// -------------------------------------------------------------
// Estas funciones simulan el comportamiento del backend para
// poder mostrar el flujo visual completo (validacion de
// contraseña y recuperacion por codigo).
//
// El compañero de backend debe reemplazar el contenido de cada
// funcion por llamadas reales a la API. Las firmas se pueden
// mantener para no tocar los componentes.
// =============================================================

// ---- Validacion de contraseña ----
// Reglas (mas estrictas): 10+ caracteres, mayuscula, minuscula,
// numero, simbolo y sin espacios. La lista es la fuente de verdad
// para pintar el checklist en la UI.
export const PASSWORD_RULES = [
  { key: 'length', label: 'Mínimo 10 caracteres',        test: p => p.length >= 10 },
  { key: 'upper',  label: 'Una letra mayúscula (A-Z)',   test: p => /[A-Z]/.test(p) },
  { key: 'lower',  label: 'Una letra minúscula (a-z)',   test: p => /[a-z]/.test(p) },
  { key: 'number', label: 'Un número (0-9)',             test: p => /[0-9]/.test(p) },
  { key: 'symbol', label: 'Un símbolo (!@#$%&*…)',       test: p => /[^A-Za-z0-9]/.test(p) },
  { key: 'nospace',label: 'Sin espacios en blanco',      test: p => p.length > 0 && !/\s/.test(p) },
]

export function validatePassword(password) {
  const p = password || ''
  const checks = {}
  PASSWORD_RULES.forEach(rule => { checks[rule.key] = rule.test(p) })
  const valid = PASSWORD_RULES.every(rule => rule.test(p))
  return { valid, checks }
}

// Nivel de fortaleza (0-4) para la barra visual.
// Se calcula como proporción de reglas cumplidas.
export function passwordStrength(password) {
  const { checks } = validatePassword(password)
  const passed = Object.values(checks).filter(Boolean).length
  if (passed === 0) return 0
  return Math.max(1, Math.min(4, Math.round((passed / PASSWORD_RULES.length) * 4)))
}

// ---- Recuperacion por codigo ----
// Simula el envio de un codigo de 6 digitos al correo.
// Backend real: enviar email con el codigo y guardar su hash + expiracion.
export function sendRecoveryCode(email) {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const payload = {
    email,
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
  }
  localStorage.setItem('itsio-recovery', JSON.stringify(payload))
  // Para la demo devolvemos el codigo y asi mostrarlo en pantalla.
  // En produccion NUNCA se devuelve el codigo al cliente.
  return code
}

// Verifica el codigo ingresado contra el guardado.
export function verifyRecoveryCode(code) {
  const raw = localStorage.getItem('itsio-recovery')
  if (!raw) return { ok: false, reason: 'No hay una solicitud de recuperación activa.' }
  try {
    const data = JSON.parse(raw)
    if (Date.now() > data.expiresAt) {
      return { ok: false, reason: 'El código expiró. Solicita uno nuevo.' }
    }
    if (String(code).trim() !== data.code) {
      return { ok: false, reason: 'El código es incorrecto.' }
    }
    return { ok: true, email: data.email }
  } catch {
    return { ok: false, reason: 'Solicitud inválida.' }
  }
}

// Limpia la solicitud de recuperacion (tras cambiar la contraseña).
export function clearRecovery() {
  localStorage.removeItem('itsio-recovery')
}
