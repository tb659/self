import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAMap from 'vue-amap'
import Print from '@/utils/print'
Vue.use(Print) // 注册

import 'tinymce/skins/ui/oxide/skin.css'
// import Axios from 'axios'
import Http from '@/api/http'

import ElementUI from 'Element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import * as filters from './filters' // global filters

Vue.use(ElementUI)
Vue.use(Http)
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: 'your amap key',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
