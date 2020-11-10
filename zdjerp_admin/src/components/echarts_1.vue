<template>
  <div ref="echart1_1" id="echart1_1"></div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  props: ['path'],
  data () {
    return {
      myChart: '',
      websock: null,
      seriesData: [],
      yAxisData: []
      // path: '39.103.141.62:8080/zdj-admin' /// 192.168.1.104:8076  39.103.141.62:8076
    }
  },
  mounted () {
    // 初始
    this.myChart = this.$echarts.init(document.getElementById('echart1_1'))
    this.echarts_1()
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.websock.close()
    this.myChart.clear()
  },
  methods: {
    initWebSocket () {
      let token = Cookies.get('token')
      const wsuri = 'ws://' + this.path + '/websocket/totalEachProcessCompleteToday/' + token
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
      let data = redata.data
      // console.log(data)
      this.yAxisData = data.yAxisData
      this.seriesData = data.seriesData
      this.echarts_1()
    },
    websocketsend (Data) {
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) {
      // 关闭
      console.log('断开连接', e)
    },
    echarts_1 () {
      var myChart = this.$echarts.init(document.getElementById('echart1_1'))
      let that = this
      var option = {
        tooltip: {
          trigger: 'axis',
          showDelay: 0,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '7%',
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category', // 轴类型， 默认为 'category'
          axisLabel: {
            // 坐标轴标签
            show: true, // 是否显示
            inside: false, // 是否朝内
            margin: 5, // 刻度标签与轴线之间的距离
            color: '#5A8BB4', // 默认取轴线的颜色
            fontWeight: 'bold',
            interval: 0,
            rotate: 0, // 让坐标值旋转一定的角度
            formatter: function (name) {
              return name.length > 5 ? name.slice(0, 4) + '...' : name
            }
          },
          axisTick: {
            alignWithLabel: true,
            show: false
          },
          axisLine: { show: false }, // 坐标轴轴线
          nameLocation: 'end', // 轴名称相对位置
          data: that.yAxisData
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            // 坐标轴标签
            show: true, // 是否显示
            inside: false, // 是否朝内
            rotate: 0, // 旋转角度
            margin: 5, // 刻度标签与轴线之间的距离
            color: '#5A8BB4', // 默认取轴线的颜色
            fontWeight: 'bold'
          },
          axisLine: { show: false }, // 坐标轴轴线
          nameLocation: 'end', // 轴名称相对位置
          axisTick: {
            alignWithLabel: true,
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            // barWidth: 50,
            data: that.seriesData,
            label: {
              // 图形上的文本标签
              show: true,
              position: 'top', // 标签的位置
              offset: [0, 0], // 标签文字的偏移，此处表示向上偏移40
              color: '#0EFCFF', // 标签字体颜色
              fontSize: '18px' // 标签字号
            },
            itemStyle: {
              // 图形样式
              normal: {
                // normal 图形在默认状态下的样式;
                color: function (params) {
                  // 渐变颜色
                  var colorList = [
                    ['#0282DE', '#3F28D0'],
                    ['#FED501', '#FC9501'],
                    ['#63DDE3', '#0383DE'],
                    ['#FE991A', '#FE431B'],
                    ['#8E7CF2', '#494EE5'],
                    ['#F559B2', '#E54546'],
                    ['#B255FF', '#720CC8'],
                    ['#FDA768', '#CE4E57'],
                    ['#89FFD1', '#28D08F'],
                    ['#FEAEF4', '#D028BA']
                  ]

                  var colorItem = colorList[params.dataIndex]
                  return {
                    colorStops: [
                      {
                        offset: 0, // 颜色的开始位置
                        color: colorItem[0] // 0% 处的颜色
                      },
                      {
                        offset: 0.6, // 颜色的结束位置
                        color: colorItem[1] // 100% 处的颜色
                      }
                    ]
                  }
                }
              }
            }
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      // /* 窗口自适应，关键代码 */
      setTimeout(function () {
        window.onresize = function () {
          myChart.resize()
        }
      }, 200)
    }
  }
}
</script>
<style>
#echart1_1 {
  width: 100%;
  height: 375px;
  color: #ffffff;
}
</style>
