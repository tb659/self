import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from './api'

import ElementUI from 'Element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$http = http

Vue.use(ElementUI)
// Vue.use(Http)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
