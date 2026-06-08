<template>
  <v-card class="add-card">
    <div class="add-head">
      <div>
        <p class="vault-eyebrow">New entry</p>
        <h2 class="text-h6 font-weight-bold">Add to vault</h2>
      </div>
      <v-btn icon variant="text" size="small" @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- Type selector -->
    <div class="type-bar">
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
            <v-icon start>mdi-content-save-outline</v-icon>Save
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { vMaska } from 'maska/vue'
import { toast } from '../composables/useToast'

const emit = defineEmits(['saved', 'close'])

const entryTypes = [
  { short: 'Password', value: 'Password', icon: 'mdi-key-variant' },
  { short: 'Card', value: 'Card', icon: 'mdi-credit-card-outline' },
  { short: 'Bank', value: 'Bank', icon: 'mdi-bank-outline' },
  { short: 'ID', value: 'ID', icon: 'mdi-card-account-details-outline' },
  { short: 'Note', value: 'Note', icon: 'mdi-note-text-outline' }
]

const entryType = ref('Password')
const formRef = ref(null)
const showPassword = ref(false)
const saving = ref(false)

const form = ref(getEmptyForm('Password'))

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

  saving.value = true
  try {
    const data = { ...form.value }
    switch (entryType.value) {
      case 'Password': await window.electronAPI.passwords.add(data); break
      case 'Card':
        data.card_number = data.card_number.replace(/\s/g, '')
        await window.electronAPI.cards.add(data)
        break
      case 'Bank': await window.electronAPI.bankAccounts.add(data); break
      case 'ID': await window.electronAPI.ids.add(data); break
      case 'Note': await window.electronAPI.notes.add(data); break
    }
    form.value = getEmptyForm(entryType.value)
    formRef.value?.resetValidation()
    emit('saved')
  } catch {
    toast.error('Could not save entry. Please try again.')
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

.cursor-pointer {
  cursor: pointer;
}
</style>
