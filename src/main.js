import { createApp } from 'vue'
import './style.css'
import monitor from './monitor.esm.js'
import errorStackParser from 'error-stack-parser'
import { findCodeBySourceMap } from "./utils";
import router from './router/index.js'
import App from './App.vue'
import { createPinia } from "pinia";

const app = createApp(App)

// app.use(monitor, {
//     url: 'http://localhost:9800/reportData'
// })
app.use(router)
app.use(createPinia())
app.config.errorHandler = (err, vm) => {
    const errorStack = errorStackParser.parse(err)
    console.log("🚀 ~ errorStack:", findCodeBySourceMap(errorStack[0]))
}
app.mount('#app')
