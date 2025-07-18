import { createApp } from 'vue'
import './style.css'
import monitor from './monitor.esm.js'
import router from './router/index.js'
import App from './App.vue'
import { createPinia } from "pinia";

const app = createApp(App)

app.use(monitor, {
    url: 'http://localhost:9800/reportData'
})
app.use(router)
app.use(createPinia())
app.mount('#app')
