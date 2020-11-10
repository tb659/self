import http from '@/utils/http'
import qs from 'qs'

const getUser3 = (params) => {
  return http.put('/api/user3', qs.stringify(params))
}

export default {
  getUser3
}
