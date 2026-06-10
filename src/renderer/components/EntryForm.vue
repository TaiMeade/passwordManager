<template>
  <v-card class="add-card">
    <div class="add-head">
      <div style="min-width:0">
        <p class="vault-eyebrow">{{ isEdit ? 'Edit entry' : 'New entry' }}</p>
        <h2 class="text-h6 font-weight-bold text-truncate">{{ isEdit ? editTitle : 'Add to vault' }}</h2>
      </div>
      <v-btn icon variant="text" size="small" @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- Type selector (add) / frozen type chip (edit) -->
    <div v-if="!isEdit" class="type-bar">
      <button
        v-for="t in entryTypes"
        :key="t.value"
        type="button"
        class="type-pill"
        :class="{ active: entryType === t.value }"
        @click="entryType = t.value"
      >
        <v-icon size="20">{{ t.icon }}</v-icon>
        <span>{{ t.short }}</span>
      </button>
    </div>
    <div v-else class="edit-type">
      <span class="edit-type-chip" :style="{ '--accent': activeType.accent }">
        <v-icon size="15">{{ activeType.icon }}</v-icon>{{ activeType.kind }}
      </span>
    </div>

    <v-card-text class="pt-2">
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <!-- Password Fields -->
        <template v-if="entryType === 'Password'">
          <v-text-field v-model="form.service" label="Service" maxlength="30" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-application-outline" class="mb-2" />
          <v-text-field v-model="form.email" label="Email" maxlength="30" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-email-outline" class="mb-2" />
          <v-text-field v-model="form.username" label="Username" maxlength="30" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-account-outline" class="mb-2" />
          <v-text-field
            v-model="form.password"
            label="Password"
            maxlength="30"
            :rules="[required]"
            :type="showPassword ? 'text' : 'password'"
            density="comfortable"
            prepend-inner-icon="mdi-lock-outline"
            class="mb-2"
          >
            <template #append-inner>
              <v-icon class="me-1 cursor-pointer" @click="showPassword = !showPassword">
                {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
              <v-tooltip text="Generate strong password" location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props" color="primary" class="cursor-pointer" @click="form.password = generatePassword()">
                    mdi-auto-fix
                  </v-icon>
                </template>
              </v-tooltip>
            </template>
          </v-text-field>
        </template>

        <!-- Card Fields -->
        <template v-if="entryType === 'Card'">
          <v-text-field v-model="form.cardholder" label="Cardholder" maxlength="30" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-account-outline" class="mb-2" />
          <v-text-field v-model="form.card_number" v-maska="'#### #### #### ####'" label="Card Number" inputmode="numeric" placeholder="1234 5678 9012 3456" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-credit-card-outline" class="mb-2" />
          <v-text-field v-model="form.expiry_date" v-maska="'##/##'" label="Expiry Date" placeholder="MM/YY" inputmode="numeric" :rules="[required, expiryRule]" density="comfortable" prepend-inner-icon="mdi-calendar-outline" class="mb-2" />
          <v-text-field v-model="form.cvv" v-maska="'####'" label="CVV" inputmode="numeric" :type="showPassword ? 'text' : 'password'" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-lock-outline" class="mb-2">
            <template #append-inner>
              <v-icon class="cursor-pointer" @click="showPassword = !showPassword">
                {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>
        </template>

        <!-- Bank Account Fields -->
        <template v-if="entryType === 'Bank'">
          <v-text-field v-model="form.bank" label="Bank / Financial Institution" maxlength="30" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-bank-outline" class="mb-2" />
          <v-text-field v-model="form.routing" v-maska="'#########'" label="Routing Number" inputmode="numeric" placeholder="9 digits" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-pound" class="mb-2" />
          <v-text-field v-model="form.account" v-maska="'#################'" label="Account Number" inputmode="numeric" :type="showPassword ? 'text' : 'password'" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-lock-outline" class="mb-2">
            <template #append-inner>
              <v-icon class="cursor-pointer" @click="showPassword = !showPassword">
                {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>
        </template>

        <!-- ID Fields -->
        <template v-if="entryType === 'ID'">
          <v-text-field v-model="form.id_type" label="ID Type" maxlength="30" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-card-account-details-outline" class="mb-2" />
          <v-text-field v-model="form.id_number" label="ID Number" maxlength="30" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-pound" class="mb-2" />
        </template>

        <!-- Note Fields -->
        <template v-if="entryType === 'Note'">
          <v-text-field v-model="form.title" label="Title" maxlength="30" :rules="[required]" density="comfortable" prepend-inner-icon="mdi-format-title" class="mb-2" />
          <v-textarea v-model="form.content" label="Content" rows="5" :rules="[required]" density="comfortable" auto-grow class="mb-2" />
        </template>

        <div class="d-flex ga-3 mt-2">
          <v-btn variant="text" class="flex-grow-1" @click="$emit('close')">Cancel</v-btn>
          <v-btn type="submit" color="primary" class="flex-grow-1 font-weight-bold" :loading="saving">
            <v-icon start>{{ isEdit ? 'mdi-check' : 'mdi-content-save-outline' }}</v-icon>
            {{ isEdit ? 'Save changes' : 'Save' }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { vMaska } from 'maska/vue'
import { toast } from '../composables/useToast'

const props = defineProps({
  // Entry to edit; null means add mode
  entry: { type: Object, default: null },
  type: { type: String, default: 'Password' }
})

const emit = defineEmits(['saved', 'close'])

const entryTypes = [
  { short: 'Password', kind: 'Password', value: 'Password', icon: 'mdi-key-variant', accent: '#ffcb05' },
  { short: 'Card', kind: 'Card', value: 'Card', icon: 'mdi-credit-card-outline', accent: '#5aa9e6' },
  { short: 'Bank', kind: 'Bank account', value: 'Bank', icon: 'mdi-bank-outline', accent: '#3fb57e' },
  { short: 'ID', kind: 'ID', value: 'ID', icon: 'mdi-card-account-details-outline', accent: '#b18cf0' },
  { short: 'Note', kind: 'Secure note', value: 'Note', icon: 'mdi-note-text-outline', accent: '#f08a5a' }
]

const isEdit = computed(() => !!props.entry)
const entryType = ref(props.entry ? props.type : 'Password')
const formRef = ref(null)
const showPassword = ref(false)
const saving = ref(false)

const form = ref(props.entry ? getFormFromEntry(props.type, props.entry) : getEmptyForm('Password'))

const activeType = computed(() => entryTypes.find(t => t.value === entryType.value))

// Frozen at open so the heading doesn't shift while the user types
const editTitle = props.entry
  ? props.entry.service || props.entry.cardholder || props.entry.bank || props.entry.id_type || props.entry.title || 'Update entry'
  : ''

const required = v => !!v || 'This field is required'
const expiryRule = v =>
  !v || /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) || 'Use MM/YY'

watch(entryType, (type) => {
  form.value = getEmptyForm(type)
  showPassword.value = false
  formRef.value?.resetValidation()
})

function getEmptyForm(type) {
  switch (type) {
    case 'Password': return { service: '', email: '', username: '', password: '' }
    case 'Card': return { cardholder: '', card_number: '', expiry_date: '', cvv: '' }
    case 'Bank': return { bank: '', routing: '', account: '' }
    case 'ID': return { id_type: '', id_number: '' }
    case 'Note': return { title: '', content: '' }
    default: return {}
  }
}

function getFormFromEntry(type, e) {
  switch (type) {
    case 'Password': return { service: e.service, email: e.email, username: e.username, password: e.password }
    case 'Card': return {
      cardholder: e.cardholder,
      // Stored as raw digits — regroup for the masked field
      card_number: e.card_number.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || e.card_number,
      expiry_date: e.expiry_date,
      cvv: e.cvv
    }
    case 'Bank': return { bank: e.bank, routing: e.routing, account: e.account }
    case 'ID': return { id_type: e.id_type, id_number: e.id_number }
    case 'Note': return { title: e.title, content: e.content }
    default: return {}
  }
}

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='
  let result = ''
  const array = new Uint32Array(16)
  crypto.getRandomValues(array)
  for (let i = 0; i < 16; i++) {
    result += chars[array[i] % chars.length]
  }
  showPassword.value = true
  return result
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const api = {
    Password: window.electronAPI.passwords,
    Card: window.electronAPI.cards,
    Bank: window.electronAPI.bankAccounts,
    ID: window.electronAPI.ids,
    Note: window.electronAPI.notes
  }[entryType.value]

  saving.value = true
  try {
    const data = { ...form.value }
    if (entryType.value === 'Card') {
      data.card_number = data.card_number.replace(/\s/g, '')
    }
    if (isEdit.value) {
      await api.update(props.entry.id, data)
    } else {
      await api.add(data)
      form.value = getEmptyForm(entryType.value)
      formRef.value?.resetValidation()
    }
    emit('saved')
  } catch {
    toast.error(isEdit.value ? 'Could not save changes. Please try again.' : 'Could not save entry. Please try again.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.add-card {
  background: var(--vault-surface);
  border: 1px solid var(--vault-hairline);
}

.add-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 8px;
}

.type-bar {
  display: flex;
  gap: 6px;
  padding: 4px 20px 8px;
  flex-wrap: wrap;
}

.type-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
  min-width: 58px;
  padding: 9px 4px;
  border-radius: 12px;
  border: 1px solid var(--vault-hairline);
  background: transparent;
  color: var(--vault-text-dim);
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.18s ease;
}

.type-pill:hover {
  border-color: var(--vault-hairline-strong);
  color: var(--vault-text);
}

.type-pill.active {
  color: var(--vault-text);
  border-color: transparent;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 18%, transparent);
}

.type-pill.active .v-icon {
  color: rgb(var(--v-theme-primary));
}

.edit-type {
  padding: 4px 20px 10px;
}

.edit-type-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 99px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent, var(--vault-gold));
  background: color-mix(in srgb, var(--accent, var(--vault-gold)) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent, var(--vault-gold)) 35%, transparent);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
