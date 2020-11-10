import Vue from 'vue'
import profile from './profile.vue'
import router from '../../router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(profile)
}).$mount('#app')
