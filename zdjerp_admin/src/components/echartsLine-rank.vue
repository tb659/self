<template>
   <div id="rankCharts">
   </div>
</template>

<script>
export default {
  name: 'echartsLine-rank',
  mounted () {
    this.lineChart()
  },
  methods: {
    lineChart () {
      var myChart = this.$echarts.init(document.getElementById('rankCharts'))
      myChart.setOption({
        title: {
          text: '产成品库存情况',
          textStyle: {
            align: 'left',
            color: '#2b94dc',
            fontSize: 15
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '1%',
          right: '7%',
          bottom: '1%',
          top: '30',
          containLabel: true
        },
        yAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          },
          data: ['构件AP-1', '构件AP-2', '构件AP-3', '构件AP-4', '构件AP-5', '构件AP-6'],
          splitLine: {
            show: false
          }
        },
        dataZoom: [
          { // 第一个 dataZoom 组件
            type: 'inside',
            show: true,
            yAxisIndex: [0],
            start: 0, // 默认为1
            end: 50
          }

        ],
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontSize: 11,
              color: '#D5CBE8'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [{
          // name: '告警',
          type: 'bar',
          barWidth: 23,
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{c}',
              color: '#fff'
            }
          },
          itemStyle: {
            normal: {
              barBorderWidth: '0',
              barBorderRadius: [0, 10, 10, 0],
              barBorderColor: '#f97b00',
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#0057fd' // 100% 处的颜色
              }, {
                offset: 1,
                color: '#41E1D4' // 0% 处的颜色
              }])
            },
            emphasis: {
              barBorderColor: '#fff'
            }
          },
          // 顺序 从下向上 传入
          data: [85, 20, 55, 60, 98, 75]
        }]
      })
    }
  }
}
</script>

<style scoped>
#rankCharts{
  width: 100%;height:290px;
}
</style>
