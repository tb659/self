import Vue from 'vue';
import Router from 'vue-router';
import index from './c/index.vue'
import no2 from './c/no2.vue'
import no3 from './c/no3.vue'
import no4 from './c/no4.vue'
import no5 from './c/no5.vue'
import no6 from './c/no6.vue'
import no41 from './c/no4_router.vue'
import no31 from './c/no3_router.vue'
Vue.use(Router)
export default new Router({
  routes: [{
    path: '/',
    name: index,
    component: index
  }, {
    path: '/no2',
    name: no2,
    component: no2
  }, {
    path: '/no3',
    name: no3,
    component: no3
  }, {
    path: '/no4',
    name: no4,
    component: no4
  }, {
    path: '/no5',
    name: no5,
    component: no5
  }, {
    path: '/no6',
    name: no6,
    component: no6
  }, {
    path: '/no41/:type/:name/:uid',
    name: no41,
    component: no41
  }, {
    path: '/no31/:type/:name',
    name: no31,
    component: no31
  }]
})
