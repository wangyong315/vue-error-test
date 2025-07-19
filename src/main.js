import { createApp } from 'vue'
import './style.css'
import monitor from './monitor.esm.js'
import errorStackParser from 'error-stack-parser'
import { findCodeBySourceMap } from "./utils";
import router from './router/index.js'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import App from './App.vue'
import { createPinia } from "pinia";

const app = createApp(App)

// app.use(monitor, {
//     url: 'http://localhost:9800/reportData'
// })
app.use(router)
app.use(createPinia())
app.use(ElementPlus)
app.config.errorHandler = (err, vm) => {
    const errorStack = errorStackParser.parse(err)
    console.log("🚀 ~ errorStack:", findCodeBySourceMap(errorStack[0]))
    const jsError = {
        stack_frames: errorStack,
        message: err.message,
        stack: err.stack,
        error_name: err.name
    }
    vm.$message.error(`出发了一个${err.name}错误`)
    localStorage.setItem('jsErrorList', JSON.stringify(jsError))
}
app.mount('#app')
