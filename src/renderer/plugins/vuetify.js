import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: '#1e1e1e',
          surface: '#2c2c2c',
          primary: '#4caf50',
          secondary: '#388e3c',
          error: '#cf6679'
        }
      },
      light: {
        colors: {
          background: '#ffffff',
          surface: '#ffffff',
          primary: '#0866ff',
          secondary: '#1565c0',
          error: '#b00020'
        }
      }
    }
  }
})
