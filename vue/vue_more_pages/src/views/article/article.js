import Vue from 'vue'
import article from './article.vue'
import router from '../../router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(article)
}).$mount('#app')
