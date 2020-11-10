import http from '@/utils/http'

const uploadImg = (params) => {
  return http.post('img', {params})
}

export default {
  uploadImg
}