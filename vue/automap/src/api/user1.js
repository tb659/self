import http from '@/utils/http'

const getUser1 = (params) => {
  return http.get('/api/user1', {params})
}

export default {
  getUser1
}
