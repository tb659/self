import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Http from './http'
import md5 from 'js-md5'
import echarts from 'echarts'

import moment from 'moment'

// Base64
import base64 from 'js-base64'
// 数值计算
import { accAdd, accSub, accMul, accDiv } from './utils/xmath'

// 导入字体图标
import './assets/fonts/iconfont.css'
// import 'tinymce/skins/ui/oxide/skin.css'

// 引入全局样式
import './assets/styles/global.scss'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
const settings = require('@/settings')

Vue.use(Http)
Vue.use(VueQuillEditor)

Vue.filter('datefmt', function(input, fmtstring) {
  return moment(input).format(fmtstring)
  // 当input为时间戳时，需转为Number类型
  // Number(crtTime) | datefmt('YYYY-MM-DD HH:MM:SS')
})
Vue.prototype.$successTip = function(msg) {
  this.$message({ duration: 2000, message: msg, type: 'success', offset: 200 })
}
Vue.filter('priceToFixed', function(price, n) {
  n = n || 2
  return (price = Number(price).toFixed(n))
})

Vue.config.productionTip = false
Vue.prototype.$errorTip = function(msg) {
  this.$message({ duration: 2000, message: msg, type: 'error', offset: 200 })
}
Vue.prototype.$infoTip = function(msg) {
  this.$message({ duration: 2000, message: msg, type: 'info', offset: 200 })
}
Vue.prototype.$picUpload = settings.PictureUploadUrl
Vue.prototype.$picDownload = settings.PictureDownloadUrl
Vue.prototype.$baseRequestUrl = settings.O2OBaseUrl
Vue.prototype.$templateDownloadUrl = settings.TemplateDownloadUrl
Vue.prototype.$wsUri = settings.WS_URI

Vue.prototype.$base64 = base64.Base64
Vue.prototype.$md5 = md5

Vue.prototype.$moment = moment

Vue.prototype.$echarts = echarts

Vue.prototype.$accAdd = accAdd
Vue.prototype.$accSub = accSub
Vue.prototype.$accMul = accMul
Vue.prototype.$accDiv = accDiv


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 跳转后返回顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
