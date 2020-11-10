<template>
      <div id="echart3_3"></div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.echarts_3()
  },
  methods: {
    echarts_3 () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('echart3_3'))
      var seriesData = [20, 40, 60] // 系列中数据内容数组
      var titlename = ['项目1项目1项目1', '项目2项目2项目2', '项目3项目3项目3'] // 类目数据，在类目轴（type: 'category'）中有效。
      var barData = []
      var yAxisData2 = JSON.parse(JSON.stringify(seriesData))
      yAxisData2 = yAxisData2.map(item => item + '%')
      seriesData.reverse()
      for (var i = 0; i < titlename.length; i++) {
        barData.push(100)
      }

      var option = {
        grid: {
          // 直角坐标系内绘图网格
          left: 200, // grid 组件离容器左侧的距离,
          // left的值可以是80这样具体像素值，
          // 也可以是'80%'这样相对于容器高度的百分比
          top: 40,
          right: 130,
          bottom: 40,
          containLabel: false // gid区域是否包含坐标轴的刻度标签。为true的时候，
          // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
          // 所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
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
        yAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              // 坐标轴标签
              show: true, // 是否显示
              inside: false, // 是否朝内
              rotate: 0, // 旋转角度
              color: '#81DDFF', // 默认取轴线的颜色
              margin: '160',
              fontWeight: 'bold',

              textStyle: {
                align: 'left',
                baseline: 'middle'
              },
              formatter: function (name) {
                return name.length > 10 ? name.slice(0, 10) + '...' : name
              }
            },
            data: titlename // 类目数据，在类目轴（type: 'category'）中有效。
            // 如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
          },
          {
            show: true,
            inverse: true,
            data: yAxisData2,
            axisLabel: {
              textStyle: {
                fontSize: '18px',
                color: '#81DDFF'
              }
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          // 系列列表。每个系列通过 type 决定自己的图表类型
          {
            name: '%', // 系列名称
            type: 'bar', // 柱状、条形图
            barWidth: 10, // 柱条的宽度,默认自适应
            data: seriesData, // 系列中数据内容数组
            label: {
              // 图形上的文本标签
              show: false,
              position: 'right', // 标签的位置
              offset: [0, 0], // 标签文字的偏移，此处表示向上偏移40
              formatter: '{c}{a}', // 标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
              color: 'black', // 标签字体颜色
              fontSize: '18px' // 标签字号
            },
            itemStyle: {
              // 图形样式
              normal: {
                // normal 图形在默认状态下的样式;
                // emphasis图形在高亮状态下的样式
                barBorderRadius: 5, // 柱条圆角半径,单位px.
                // 此处统一设置4个角的圆角大小;
                // 也可以分开设置[10,10,10,10]顺时针左上、右上、右下、左下
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: '#3F28D0' // 柱图渐变色起点颜色
                  },
                  {
                    offset: 1,
                    color: '#0282DE' // 柱图渐变色终点颜色
                  }
                ])
              }
            },
            zlevel: 1 // 柱状图所有图形的 zlevel 值,
            // zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
          },
          {
            name: '进度条背景',
            type: 'bar',
            barGap: '-100%', // 不同系列的柱间距离，为百分比。
            // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
            // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
            // 并且是对此坐标系中所有 'bar' 系列生效。
            barWidth: 9,
            data: barData,
            color: '#151B87', // 柱条颜色
            itemStyle: {
              normal: {
                barBorderRadius: 5
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
#echart3_3{
    width:100%;
    height:236px;
    color: #ffffff;
  }
</style>
