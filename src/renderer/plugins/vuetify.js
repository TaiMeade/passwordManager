import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '../assets/app.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  defaults: {
    VBtn: { rounded: 'lg', class: 'text-none', style: 'letter-spacing:0.02em;' },
    VTextField: { variant: 'outlined', rounded: 'lg', color: 'primary' },
    VTextarea: { variant: 'outlined', rounded: 'lg', color: 'primary' },
    VSelect: { variant: 'outlined', rounded: 'lg', color: 'primary' },
    VCard: { rounded: 'lg' }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#0e0f12',
          surface: '#16181d',
          'surface-bright': '#1d2026',
          primary: '#ffcb05',
          secondary: '#8a8a82',
          success: '#3fb57e',
          info: '#5aa9e6',
          warning: '#f0a800',
          error: '#e5484d',
          'on-primary': '#1a1500',
          'on-surface': '#f3f1ea',
          'on-background': '#f3f1ea'
        }
      },
      light: {
        dark: false,
        colors: {
          background: '#f3efe4',
          surface: '#ffffff',
          'surface-bright': '#fbf7ee',
          primary: '#e0a800',
          secondary: '#6b6e73',
          success: '#1f9d63',
          info: '#2f7fc4',
          warning: '#c98a00',
          error: '#c0353a',
          'on-primary': '#1a1500',
          'on-surface': '#1a1b1e',
          'on-background': '#1a1b1e'
        }
      }
    }
  }
})
