import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
import {createPinia} from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/styles/main.css';


axios.defaults.baseURL = 'http://localhost:8080'

library.add(fas, far)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')
