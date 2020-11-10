import http from '@/utils/http'
// import qs from 'qs'

const getUser4 = params => {
  return http.delete('/api/user4', { params })
}

export default {
  getUser4
}
