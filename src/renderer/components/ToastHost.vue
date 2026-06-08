<template>
  <div class="toast-host">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="t.type"
        role="status"
        @click="dismiss(t.id)"
      >
        <v-icon class="toast-icon" size="20">{{ t.icon }}</v-icon>
        <span class="toast-msg">{{ t.message }}</span>
        <v-icon class="toast-close" size="16">mdi-close</v-icon>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-host {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
  pointer-events: none;
  max-width: min(92vw, 400px);
}

.toast {
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 260px;
  padding: 12px 12px 12px 14px;
  border-radius: 12px;
  background: var(--vault-surface);
  color: var(--vault-text);
  border: 1px solid var(--vault-hairline);
  border-left: 3px solid var(--accent, var(--vault-gold));
  box-shadow: var(--vault-shadow);
}

.toast.success { --accent: #3fb57e; }
.toast.error { --accent: #e5484d; }
.toast.warning { --accent: #f0a800; }
.toast.info { --accent: var(--vault-gold); }

.toast-icon {
  color: var(--accent, var(--vault-gold));
  flex: none;
}

.toast-msg {
  flex: 1;
  font-size: 0.88rem;
  line-height: 1.35;
}

.toast-close {
  color: var(--vault-text-dim);
  flex: none;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.toast:hover .toast-close {
  opacity: 1;
}

/* Enter from the right, leave by collapsing */
.toast-enter-active {
  transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.32s ease;
}
.toast-leave-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
  position: absolute;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.96);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.96);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
