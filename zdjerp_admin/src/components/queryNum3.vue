<template>
    <p>{{num}}</p>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  props: ['path'],
  data () {
    return {
      // path: '39.103.141.62:8080/zdj-admin', /// 192.168.1.104:8076  39.103.141.62:8076
      num: 0
    }
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.websock.close()
  },
  methods: {
    // 成品库存数据获取（请求参数在额外说明）
    initWebSocket () {
      let token = Cookies.get('token')
      const wsuri = 'ws://' + this.path + '/websocket/totalShipmentsToday/' + token
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () {
      // 连接建立之后执行send方法发送数据
    },
    websocketonerror () {
      // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage (e) {
      // 数据接收
      const redata = JSON.parse(e.data)
      // console.log(redata)
      this.num = redata.data
    },
    websocketsend (Data) {
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) {
      // 关闭
      console.log('断开连接', e)
    }
  }
}
</script>
