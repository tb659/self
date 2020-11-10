import Vue from 'vue'
import index from './index.vue'
import router from '../../router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(index)
}).$mount('#app')
