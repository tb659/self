import axios from 'axios'

import { Loading } from 'element-ui'
import router from '../router'
// import store from '../store/index'
import { API_BASE_URL } from '@/settings.js'

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000 * 12
})

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

instance.interceptors.request.use(
  config => {
    // const token = store.state.token
    // token && (config.headers.Authorization = token)

    startLoading()
    return config
  },
  error => Promise.error(error)
)

instance.interceptors.response.use(
  // res => (res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)),
  // endLoading(),
  res => {
    if (res.status === 200) {
      endLoading()
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(res)
    }
  },
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 处理断网的情况: 请求超时或断网时，更新state的network状态
      // store.commit('changeNetwork', false)
    }
  }
)

/*
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin()
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      alert('登录过期，请重新登录')
      // localStorage.removeItem('token')
      // store.commit('loginSuccess', null)
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      alert('请求的资源不存在')
      break
    default:
      console.log(other)
  }
}

let loading
//内存中正在请求的数量
let loadingNum = 0
function startLoading() {
  if (loadingNum == 0) {
    loading = Loading.service({
      lock: true,
      text: '拼命加载中...',
      background: 'rgba(0, 0, 0, 0.5)'
    })
  }
  //请求数量加1
  loadingNum++
}
function endLoading() {
  //请求数量减1
  loadingNum--
  if (loadingNum <= 0) {
    loading.close()
  }
}

export default instance
