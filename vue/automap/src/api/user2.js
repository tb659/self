import http from '@/utils/http'
import qs from 'qs'

const getUser2 = params => {
  return http.post('/api/user2', qs.stringify(params))
}

export default {
  getUser2
}
