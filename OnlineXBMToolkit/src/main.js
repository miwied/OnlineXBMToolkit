import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark'
    },
    components,
    directives,
});

app.use(vuetify);
app.mount('#app');