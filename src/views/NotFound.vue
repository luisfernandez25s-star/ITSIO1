<template>
  <div class="not-found">
    <div class="nf-content">
      <span class="nf-code">404</span>
      <h2 class="nf-title">Página no encontrada</h2>
      <p class="nf-desc">La ruta solicitada no existe en el sistema.</p>
      <router-link to="/" class="nf-btn">← Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
export default { name: 'NotFound' }
</script>

<style scoped>
.not-found {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nf-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.nf-code {
  font-family: var(--font-display);
  font-size: 5rem;
  font-weight: 700;
  color: var(--border-subtle);
  letter-spacing: 0.2em;
  line-height: 1;
}

.nf-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin: 0;
}

.nf-desc {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.nf-btn {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent-primary);
  text-decoration: none;
  letter-spacing: 0.1em;
  border: 1px solid var(--border-accent);
  padding: 8px 20px;
  border-radius: var(--radius);
  background: rgba(255,140,0,0.08);
  transition: all 0.2s;
  margin-top: 8px;
}

.nf-btn:hover { background: rgba(255,140,0,0.18); }
</style>
