<template>
    <div id="myCharts"></div>
</template>

<script>
export default {
  name: 'echartsClass',
  mounted () {
    this.classChart()
  },
  methods: {
    classChart () {
      var myChart = this.$echarts.init(document.getElementById('myCharts'))
      myChart.setOption({
        title: {
          text: '近七天类别统计',
          textStyle: {
            align: 'left',
            color: '#fff',
            fontSize: 20
          },
          top: '3%',
          left: '3%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '14%',
          top: '16%',
          containLabel: true
        },
        legend: {
          data: ['1', '2'],
          right: 'center',
          top: 35,
          textStyle: {
            color: '#fff'
          },
          itemWidth: 35,
          itemHeight: 20
        },
        xAxis: {
          type: 'category',
          data: ['物料库存', '产成品', '生产中', '客户订单', '销售数量', '预生产', '发货中'],
          axisLine: {
            lineStyle: {
              color: 'white'

            }
          },
          axisLabel: {
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: 'white'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          }
        },
        dataZoom: [{
          'show': true,
          'height': 12,
          'xAxisIndex': [
            0
          ],
          bottom: '8%',
          'start': 10,
          'end': 90,
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'
        }, {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          start: 0, // 默认为1
          end: 50
        }],
        series: [{
          name: '1',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#41E1D4' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#0057fd' // 100% 处的颜色
              }], false),
              barBorderRadius: 12
            }
          },
          data: [78, 58, 75, 50, 70, 82, 53]
        },
        {
          name: '2',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#8bd46e'
              }, {
                offset: 1,
                color: '#09bcb7'
              }]),
              barBorderRadius: 11
            }

          },
          data: [80, 30, 18, 50, 100, 40, 90]
        }
        ]
      })
    }
  }
}
</script>

<style scoped>
#myCharts {
  width:100%;
  height:345px;
}
</style>
