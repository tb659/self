<template>
      <div id="echartsCenter"></div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.echartsCenter()
  },
  methods: {
    echartsCenter () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('echartsCenter'))
      var scale = 0.8
      var setaData = ['广州', '山东', '上海', '北京', '河南', '杭州', '深圳', '青岛']
      var colorData = ['#004db6', '#fcae00', '#517752', '#e0cbf0', '#188df0', '#9c26b0', '#19c7b9', '#d10d18']
      var lengData = [
        { value: 335, name: '广州' },
        { value: 310, name: '山东' },
        { value: 234, name: '上海' },
        { value: 234, name: '北京' },
        { value: 548, name: '河南' },
        { value: 135, name: '杭州' },
        { value: 135, name: '深圳' },
        { value: 448, name: '青岛' }
      ]
      myChart.setOption({
        title: {
          text: '客户分布',
          x: 'left',
          top: '5%',
          left: '15%',
          textStyle: {
            color: '#2b94dc',
            fontSize: 19 * scale
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          align: 'left',
          left: '10%',
          top: '15%',
          data: setaData,
          textStyle: {
            color: '#fff',
            fontSize: 15 * scale
          }
        },
        series: [
          {
            name: '客户分布',
            type: 'pie',
            radius: '85%',
            center: ['58%', '55%'],
            color: colorData,
            data: lengData,
            emphasis: {
              itemStyle: {
                shadowBlur: 90,
                shadowOffsetY: 30,
                shadowColor: 'rgba(0,0,0,0.8)'
              }
            }
          }
        ]
      })
      /* 窗口自适应，关键代码 */
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
  #echartsCenter{
    width:100%;
    height: 450px;
    color: #ffffff;
  }
</style>
