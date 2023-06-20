import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios";
import VueMask from 'v-mask'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

Vue.use(VueMask);

Vue.use(Toast,{
  position: "top-right",
    timeout: 1500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true
})

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  axios,
  render: function (h) { return h(App) }
}).$mount('#app')
