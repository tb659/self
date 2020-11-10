<template>
    <div id="lineCharts"></div>
</template>

<script>
export default {
  name: 'echartsLine',
  mounted () {
    this.lineChart()
  },
  methods: {
    lineChart () {
      var myChart = this.$echarts.init(document.getElementById('lineCharts'))
      myChart.setOption({
        title: {
          text: '物料库存情况',
          textStyle: {
            align: 'left',
            color: '#2b94dc',
            fontSize: 15
          },
          top: '3%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          }
        },
        grid: { height: '72%' },
        xAxis: {
          data: [
            '沙子',
            '水泥',
            '钢筋',
            '石子',
            '钢板',
            '五金'
          ],
          axisTick: {
            show: true // 隐藏X轴刻度
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff', // X轴文字颜色
              fontSize: 12
            }
          },
          axisLine: {
            show: true, // 隐藏X轴轴线
            lineStyle: {
              color: '#cd4cec'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0],
            start: 0, // 默认为1
            end: 50
          }

        ],
        yAxis: [{
          type: 'value',
          scale: true,
          nameTextStyle: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 12
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#FFFFFF'
            }
          }
        },
        {
          type: 'value',
          gridIndex: 0,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)']
            }
          }
        }
        ],
        series: [
          {
            // name: 'line',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            data: [185, 155, 165, 120, 90, 118]
          },
          {
            // name: 'bar',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(245,255,98,0.8)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(25,199,185,0.8)' // 100% 处的颜色
                }], false),
                barBorderRadius: [30, 30, 0, 0],
                shadowColor: 'rgba(0,255,225,1)',
                shadowBlur: 4
              }
            },
            data: [155, 125, 65, 90, 50, 78]
          }, {
            // name:'line',
            type: 'bar',
            barGap: '-100%',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(20,200,212,0.5)' },
                    { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                    { offset: 1, color: 'rgba(20,200,212,0)' }
                  ]
                )
              }
            },
            z: -12,
            data: [155, 125, 65, 90, 50, 78]
          },
          {
            // name: 'dotted',
            type: 'pictorialBar',
            symbol: 'rect',
            itemStyle: {
              normal: {
                color: '#0f375f'
              }
            },
            symbolRepeat: true,
            symbolSize: [12, 4],
            symbolMargin: 1,
            z: -10,
            data: [185, 155, 165, 120, 90, 118]
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
#lineCharts{
  width: 100%;height:290px;
}
</style>
