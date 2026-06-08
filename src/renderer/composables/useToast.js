import { reactive } from 'vue'

// Shared, app-wide toast queue (rendered once by ToastHost.vue).
const toasts = reactive([])
let seq = 0

const ICONS = {
  success: 'mdi-check-circle-outline',
  error: 'mdi-alert-circle-outline',
  warning: 'mdi-alert-outline',
  info: 'mdi-information-outline'
}

function push(message, { type = 'info', timeout = 3500, icon } = {}) {
  const id = ++seq
  toasts.push({ id, message, type, icon: icon || ICONS[type] || ICONS.info })
  if (timeout > 0) {
    setTimeout(() => dismiss(id), timeout)
  }
  return id
}

function dismiss(id) {
  const i = toasts.findIndex(t => t.id === id)
  if (i !== -1) toasts.splice(i, 1)
}

export const toast = {
  success: (m, o) => push(m, { ...o, type: 'success' }),
  error: (m, o) => push(m, { ...o, type: 'error' }),
  warning: (m, o) => push(m, { ...o, type: 'warning' }),
  info: (m, o) => push(m, { ...o, type: 'info' })
}

export function useToast() {
  return { toasts, dismiss, toast }
}
