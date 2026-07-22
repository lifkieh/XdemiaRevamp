import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import format from './i18n/format'
import './assets/base.css'

// locale Element UI disuplai dari vue-i18n, lihat src/i18n/index.js
Vue.use(ElementUI, { size: 'small', i18n: (kunci, nilai) => i18n.t(kunci, nilai) })
Vue.use(format)
Vue.config.productionTip = false

document.documentElement.lang = i18n.locale

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
