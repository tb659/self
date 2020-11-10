<template>
      <div id="echart2_2"></div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  props: ['path'],
  data () {
    return {
      myChart: ''
      // path: '39.103.141.62:8080/zdj-admin' /// 192.168.1.104:8076  39.103.141.62:8076
    }
  },
  created () {
    this.initWebSocket()
  },
  mounted () {
    // 初始
    this.myChart = this.$echarts.init(document.getElementById('echart2_2'))
    this.echarts_2()
  },
  destroyed () {
    this.websock.close()
    this.myChart.clear()
  },
  methods: {
    initWebSocket () {
      let token = Cookies.get('token')
      const wsuri = 'ws://' + this.path + '/websocket/totalHistogramProjectShipmentsToday/' + token
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
      this.echarts_2()
    },
    websocketsend (Data) {
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) {
      // 关闭
      console.log('断开连接', e)
    },
    echarts_2 () {
      var myChart = this.$echarts.init(document.getElementById('echart2_2'))
      let that = this
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '20',
          left: 150,
          right: '3%',
          bottom: '20',
          containLabel: false
        },
        xAxis: {
          // 直角坐标系grid中的x轴,
          // 一般情况下单个grid组件最多只能放上下两个x轴,
          // 多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
          type: 'value', // 坐标轴类型,分别有：
          // 'value'-数值轴；'category'-类目轴;
          // 'time'-时间轴;'log'-对数轴
          splitLine: { show: false }, // 坐标轴在 grid 区域中的分隔线
          axisLabel: { show: false }, // 坐标轴刻度标签
          axisTick: { show: false }, // 坐标轴刻度
          axisLine: { show: false } // 坐标轴轴线
        },
        yAxis: {
          type: 'category',
          data: that.yAxisData,
          axisLabel: {
            // 坐标轴标签
            show: true, // 是否显示
            inside: false, // 是否朝内
            rotate: 0, // 旋转角度
            color: '#5A8BB4', // 默认取轴线的颜色
            fontWeight: 'bold',
            interval: 0,
            margin: '140',
            textStyle: {
              align: 'left',
              baseline: 'middle'
            },
            formatter: function (name) {
              return name.length > 10 ? name.slice(0, 10) + '...' : name
            }
          },
          axisTick: { show: false }, // 坐标轴刻度
          axisLine: { show: false } // 坐标轴轴线
        },
        series: [
          {
            type: 'bar',
            data: that.seriesData,
            label: {
              // 图形上的文本标签
              show: true,
              position: 'right', // 标签的位置
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
                  colorList.reverse()
                  var colorItem = colorList[params.dataIndex]
                  return {
                    colorStops: [{
                      offset: 0, // 颜色的开始位置
                      color: colorItem[0]// 0% 处的颜色
                    }, {
                      offset: 0.6, // 颜色的结束位置
                      color: colorItem[1] // 100% 处的颜色
                    }]
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
  #echart2_2{
    width:100%;
    height:357px;
    color: #ffffff;
  }
</style>
