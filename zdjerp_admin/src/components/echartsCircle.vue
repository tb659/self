<template>
     <div id="myChart"></div>
</template>
<script>
export default {
  name: 'eCharts',
  data () {
    return {
      quantityOfProductsInProduction: []
    }
  },
  created () {
    this.getQuantityOfProductsInProduction()
  },
  methods: {
    getQuantityOfProductsInProduction () {
      this.$http.get(`/bigscreen/bigscreen/getQuantityOfProductsInProduction`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.quantityOfProductsInProduction = res.data
        this.drawLine()
      })
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('myChart'))
      var datas = this.quantityOfProductsInProduction
      var scale = 0.8
      var rich = {
        white: {
          color: '#fff',
          align: 'center',
          fontSize: 14 * scale,
          padding: [2, 0]
        },
        blue: {
          color: '#fff',
          fontSize: 12 * scale,
          align: 'center',
          padding: [2, 0]
        },
        hr: {
          borderColor: '#0b5263',
          width: '100%',
          borderWidth: 2,
          height: 0
        }
      }
      myChart.setOption({
        title: {
          text: '生产中各产品数量统计',
          left: 'left',
          top: '-5',
          padding: [24, 0],
          textStyle: {
            color: '#2b94dc',
            fontSize: 19 * scale,
            align: 'left'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          selectedMode: true,
          left: 'center',
          top: '86%',
          align: 'left',
          padding: [20, 0, 0, 10],
          textStyle: {
            color: '#fff',
            fontSize: 14 * scale
          }
        },
        series: [{
          name: '生产中各产品数量统计',
          type: 'pie',
          radius: ['35%', '53%'],
          center: ['55%', '55%'],
          hoverAnimation: true,
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 18 * scale
              },
              formatter: function (params, ticket, callback) {
                var total = 0 // 考生总数量
                var percent = 0 // 考生占比
                datas.forEach(function (value, index, array) {
                  total += value.value
                })
                percent = ((params.value / total) * 100).toFixed(1)
                return '{white|' + params.name + '}\n{hr|}\n{blue|' + percent + '%}'
              },
              rich: rich
            }
          },
          labelLine: {
            normal: {
              length: 20 * scale,
              length2: 10,
              lineStyle: {
                color: '#fff'
              }
            }
          },
          data: datas
        }]
      })
    }
  }
}
</script>

<style scoped>
#myChart{
  width: 100%;height:250px;
}
</style>
