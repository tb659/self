<template>
<div class="wrapper">
  <div class="container">
    <div class="dashboard-bg-image"></div>
    <div :style="marginStyle">
      <div style="position: relative;">
        <div class="body" style="width: 1920px;height: 1080px;" :style="transformStyle">
          <div class="head">
            <h1>中电建(洛阳)装配式建筑科技有限公司</h1>
            <p>PowerChina(Luoyang)Pre-fabricated Construction Technology Co.,Ltd</p>
          </div>
          <div class="mainbox">
            <div class="back"></div>
            <div class="clearfix">
              <div class="boxall-border-icon pulll_left time">
                <ul class="tiem-box">
                  <li>
                    <div>
                      <img src="../../../public/img/home/dataR.png" alt />
                    </div>
                    <div>日期</div>
                    <div id="showDate">{{redataDate}}</div>
                  </li>
                  <li>
                    <div>
                      <img src="../../../public/img/home/tiem.png" alt />
                    </div>
                    <div>时间</div>
                    <div id="showTime">{{time}}</div>
                  </li>
                  <li>
                    <div>
                      <img src="../../../public/img/home/dataN.png" alt />
                    </div>
                    <div>农历</div>
                    <div>{{lunar}}</div>
                  </li>
                  <li>
                    <div>
                      <img src="../../../public/img/home/weather.png" alt />
                    </div>
                    <div>天气</div>
                    <div>
                      <p style="margin-bottom:8px">{{type}}</p>
                      <p> {{low}}~{{high}}</p>
                    </div>
                  </li>
                </ul>
                <div class="boxallfoot"></div>
              </div>
              <div style="margin-left:445px ;">
                <ul class="queryNum">
                  <li class="boxall-border-icon">
                    <p>成品库存</p>
                    <queryNum1 :path="path"/>
                    <div class="boxallfoot"></div>
                  </li>
                  <li class="boxall-border-icon">
                    <p>今日生产完成总数</p>
                    <queryNum2 :path="path"/>
                    <div class="boxallfoot"></div>
                  </li>
                  <li class="boxall-border-icon">
                    <p>今日发货总数</p>
                    <queryNum3 :path="path"/>
                    <div class="boxallfoot"></div>
                  </li>
                </ul>
                <div class="clearfix" style="padding-bottom: 22px;">
                  <div class="pulll_left">
                    <div class="title-bg">各工序完成数量(今日)</div>
                    <div class="boxall">
                      <div  style="width:669px;height: 357px;">
                          <echartsOne :path="path" style="width: 669px;height: 357px;" />
                      </div>
                      <div class="boxfoot"></div>
                    </div>
                  </div>
                  <div class="pulll_right">
                    <div class="title-bg">项目名称发货数量(今日)</div>
                    <div class="boxall">
                      <div style="width: 643px;height: 357px;">
                        <echartsTwo :path="path"/>
                      </div>
                      <div class="boxfoot"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div @mouseover="enabled=true" @mouseleave="enabled=false">
              <div class="title-bg">项目生产进度</div>
              <div class="boxall clearfix" style="height: 236px">
                <div class="pulll_left" style="width: 50%;height:236px">
                      <div id="echart3" style="width: 100%;height:236px"></div>
                    </div>
                    <div class="pulll_right" style="width: 50%;height: 236px">
                      <div key="echart4" id="echart4" style="width: 100%;height:236px"></div>
                    </div>
                <div class="boxfoot"></div>
              </div>
            </div>
          </div>
          <div class="full-screen" @click="fullscreenHandle()" @mouseover="enabled=true" @mouseleave="enabled=false" v-show="enabled">
            <img src="../../../public/img/home/full-screen.png" alt />
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
// import jquery from "jquery";
import screenfull from 'screenfull'
import Cookies from 'js-cookie'
import echartsOne from '../../components/echarts_1'
import echartsTwo from '../../components/echarts_2'
import echartsBottom from '../../components/echarts_3'
import debounce from 'lodash/debounce'
import { getComputedStyle } from '../../utils/index'
import queryNum1 from '../../components/queryNum1'
import queryNum2 from '../../components/queryNum2'
import queryNum3 from '../../components/queryNum3'
import { clearLoginInfo } from '@/utils'
// import calendarData from '../../utils/calendarData'

export default {
  components: {
    echartsOne,
    echartsTwo,
    echartsBottom,
    queryNum1,
    queryNum2,
    queryNum3
  },
  data () {
    return {
      Two: false,
      redata: null,
      scaleX: 1,
      scaleY: 1,
      marginHorizontal: 0,
      marginHeight: 0,
      page: 1,
      limit: 6,
      total: 1,
      scheduleList: null, // 项目生产进度列表
      redataDate: '',
      lunar: '',
      time: '',
      high: '',
      low: '',
      type: '',
      enabled: true,
      path: '192.168.1.104:8076/zdjerp-admin-test', /// 192.168.1.104:8076  39.103.141.62:8076 ，，，http://39.103.141.62:8080/zdj-admin
      timeoutObj: '',
      pageNum: 1,
      swiperIndex: 0,
      tiemSchedule: null,
      t: null,
      bdDate: null,
      myChart3: '',
      myChart4: ''
    }
  },
  created () {
    this.path = this.httpString(window.SITE_CONFIG['apiURL'])
    this.initWebSocket()
    // this.scheduleInterval()
    this.t = setTimeout(this.timeFn, 1000)
  },
  mounted () {
    // 初始
    this.myChart3 = this.$echarts.init(document.getElementById('echart3'))
    this.myChart4 = this.$echarts.init(document.getElementById('echart4'))
    this.schedule()
    let token = Cookies.get('token')
    if (!token) {
      clearLoginInfo()
      this.$router.replace({ name: 'login' })
    }
    this.init()
    this.$nextTick(() => {
      this.echarts_3()
      this.echarts_4()
    })
  },
  computed: {
    transformStyle: function () {
      return {
        transform: `scale(${this.scaleX}, ${this.scaleY})`
      }
    },
    marginStyle: function () {
      return {
        margin: `${this.marginHeight}px  ${this.marginHorizontal}px`
      }
    }
  },
  destroyed () {
    clearInterval(this.tiemSchedule)
    clearTimeout(this.t)// 清除定时器
    this.myChart3.clear()
    this.myChart4.clear()
    this.websock.close()
    this.websockSchedule.close()
    window.removeEventListener('resize', this.initScale, false)
  },
  methods: {
    httpString (s) {
      s = s.toLowerCase()
      s = s.replace('http://', '')
      return (s)
    },
    // 项目生产进度
    schedule () {
      let token = Cookies.get('token')
      const wsuri = 'ws://' + this.path + '/websocket/queryProjectProductionSchedule/' + token
      this.websockSchedule = new WebSocket(wsuri)
      this.websockSchedule.onmessage = this.message
      this.websockSchedule.onopen = this.open
      this.websockSchedule.onerror = this.error
      this.websockSchedule.onclose = this.close
    },
    open () {
      // 连接建立之后执行send方法发送数据
    },
    error () {
      // 连接建立失败重连
      this.initWebSocket()
    },
    message (e) {
      // 数据接收
      const redata = JSON.parse(e.data)
      let data = redata.data
      // console.log(data)
      this.total = data.total
      this.pageNum = Math.ceil(this.total / this.limit)
      this.scheduleList = data.list
      this.$nextTick(() => {
        this.echarts_3()
        this.echarts_4()
      })
    },
    send (Data) {
      // 数据发送
      this.websock.send(Data)
    },
    close (e) {
      // 关闭
      console.log('断开连接', e)
    },

    init () {
      this.listenResize()
    },
    // 适应屏幕 缩放
    initScale () {
      let $container = document.querySelector('.container')
      let containerWidth = getComputedStyle($container, 'width').replace(
        'px',
        ''
      )
      let containerHeight = getComputedStyle($container, 'height').replace(
        'px',
        ''
      )
      containerWidth = Number(containerWidth)
      containerHeight = Number(containerHeight)
      containerWidth = isNaN(containerWidth) ? 0 : containerWidth
      containerHeight = isNaN(containerHeight) ? 0 : containerHeight
      let defaultHeight = 1080
      let defaultWidth = 1920
      // sacle 缩放比例。
      let scale = 1
      if (containerHeight < defaultHeight) {
        scale = containerHeight / defaultHeight
      }
      this.scaleX = scale
      this.scaleY = scale
      let marginWidth = defaultWidth * scale
      let marginHeight = defaultHeight * scale
      //
      this.marginHorizontal = 0
      if (containerWidth > marginWidth) {
        marginWidth = (containerWidth - marginWidth) / 2
        this.marginHorizontal = marginWidth
      }
      this.marginHeight = 0
      if (containerHeight > marginHeight) {
        marginHeight = (containerHeight - marginHeight) / 2
        this.marginHeight = marginHeight
      }
    },
    // 监听屏幕变化
    listenResize () {
      this.initScale()
      window.addEventListener(
        'resize',
        debounce(() => {
          this.initScale()
        }, 300)
      )
    },
    // 全屏
    fullscreenHandle () {
      if (!screenfull.enabled) {
        return this.$message({
          message: this.$t('fullscreen.prompt'),
          type: 'warning',
          duration: 500
        })
      }
      screenfull.toggle()
      this.enabled = false
    },
    // 天气
    initWebSocket () {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        let token = Cookies.get('token')
        const wsuri = 'ws://' + this.path + '/websocket/weather/' + token
        this.websock = new WebSocket(wsuri)
        this.websock.onmessage = this.websocketonmessage
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onclose = this.websocketclose
      }
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
      this.redataDate = data.date
      this.lunar = data.lunar
      this.high = data.high
      this.low = data.low
      this.type = data.type
      let currentTimeMillis = data.currentTimeMillis
      let timestamp = Date.parse(new Date())
      this.bdDate = timestamp - currentTimeMillis
    },
    websocketsend (Data) {
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) {
      // 关闭
      console.log('断开连接', e)
    },
    echarts_3 () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('echart3'))
      if (!this.scheduleList) {
        return
      }
      let scheduleList = this.scheduleList[0]
      var seriesData = scheduleList.percents // [20, 40, 60] // 系列中数据内容数组
      var titlename = scheduleList.projectNames // ['项目1项目1项目1', '项目2项目2项目2', '项目3项目3项目3'] // 类目数据，在类目轴（type: 'category'）中有效。
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
      // window.addEventListener('resize', function () {
      //   myChart.resize()
      // })
      /* 窗口自适应，关键代码 */
      setTimeout(function () {
        window.onresize = function () {
          myChart.resize()
        }
      }, 200)
    },
    echarts_4 () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('echart4'))
      if (!this.scheduleList) {
        return
      }
      let scheduleList = this.scheduleList[1]
      var seriesData = scheduleList.percents // [20, 40, 60] // 系列中数据内容数组
      var titlename = scheduleList.projectNames // ['项目1项目1项目1', '项目2项目2项目2', '项目3项目3项目3'] // 类目数据，在类目轴（type: 'category'）中有效。
      var barData = []
      var yAxisData2 = JSON.parse(JSON.stringify(seriesData))
      yAxisData2 = yAxisData2.map(item => item + '%')
      for (var i = 0; i < titlename.length; i++) {
        barData.push(100)
      }

      seriesData.reverse()
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
              show: true,
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
              fontSize: '18px', // 标签字号
              fontWeight: 'bold'
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
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      /* 窗口自适应，关键代码 */
      setTimeout(function () {
        window.onresize = function () {
          myChart.resize()
        }
      }, 200)
    },
    timeFn () {
      clearTimeout(this.t)// 清除定时器
      let timestamp = Date.parse(new Date())
      var dts = timestamp - this.bdDate
      let dt = new Date(dts)
      var h = dt.getHours() || 0// 获取时
      var m = dt.getMinutes() || 0// 获取分
      var s = dt.getSeconds() || 0// 获取秒
      this.time = (h >= 10 ? h : '0' + h) + ':' + (m >= 10 ? m : '0' + m) + ':' + (s >= 10 ? s : '0' + s)
      this.t = setTimeout(this.timeFn, 1000) // 设定定时器，循环运行
    }
  }
}
</script>

<style scoped>

.copyID{
  width: 100px;
  height: 100px;
  position: absolute !important;
  top: -9999999999px;
}
.el-carousel__container{
  height: 236px !important;
}

/* CSS Document */
* {
  box-sizing: border-box;
}

*,
.body {
  padding: 0px;
  margin: 0px;
  color: #00fffc;
  font-family: 'Source Han Sans CN';
}

.container {
      background-color: rgb(3, 12, 59);
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
  }
.dashboard-bg-image{
   width: 100%;
    height: 100%;
    position: absolute;
    background: url(../../../public/img/home/bj.png) no-repeat;
    background-size: 100% 100%;
}

.body {
  padding-top: 36px;
  background-size: cover;
  font-size: 20px;
  padding-bottom: 20px;

  position: relative;
  user-select: none;
  width: 100%;
  height: 100%;
  transform-origin: 0 0;
  transition: all .3s linear;
  overflow: hidden;

}
li {
  list-style-type: none;
}
i {
  margin: 0px;
  padding: 0px;
  text-indent: 0px;
}
img {
  border: none;
  max-width: 100%;
}
a {
  text-decoration: none;
  color: #399bff;
}
a.active,
a:focus {
  outline: none !important;
  text-decoration: none;
}
ol,
ul,
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  padding: 0;
  margin: 0;
}
a:hover {
  color: #06c;
  text-decoration: none !important;
}

.clearfix:after,
.clearfix:before {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.pulll_left {
  float: left;
}
.pulll_right {
  float: right;
}
/*谷哥滚动条样式*/
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  position: absolute;
}
::-webkit-scrollbar-thumb {
  background-color: #5bc0de;
}
::-webkit-scrollbar-track {
  background-color: #ddd;
}

/***/
.canvas {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  height: 99%;
  z-index: 1;
}

.loading {
  position: fixed;
  left: 0;
  top: 0;
  font-size: 18px;
  z-index: 100000000;
  width: 100%;
  height: 100%;
  background: #1a1a1c;
  text-align: center;
}
.loadbox {
  position: absolute;
  width: 160px;
  height: 150px;
  color: #aaa;
  left: 50%;
  top: 50%;
  margin-top: -100px;
  margin-left: -75px;
}
.loadbox img {
  margin: 10px auto;
  display: block;
  width: 40px;
}

.copyright {
  background: rgba(19, 31, 64, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.05);
  line-height: 50px;
  text-align: center;
  padding-right: 15px;
  bottom: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}
/* background: url(../../../public/img/home/head_bg.png) no-repeat center center; */
.head {
  height: 105px;
  background: url(../../../public/img/home/head.png) no-repeat center center;
  background-size: 100% 100%;
  margin: 0 20px 0;
  position: relative;
  z-index: 100;
}
.head h1 {
  color: #00fffc;
  text-align: center;
  font-size: 34px;
  line-height: 81px;
  word-spacing: 20px;
}
.head p {
  font-weight: bold;
  color: rgba(0, 252, 249, 1);
  text-align: center;
  position: relative;
  top: -14px;
  font-size: 14px;
  line-height: 21px;
}
.mainbox {
  padding:25px 64px 0 64px;
}
.mainbox > ul > li {
  float: left;
  margin: 0 64px;
  width: 380px;
}
.mainbox > ul > li:nth-last-child(1) {
  width: 669px;
}
/* url(../../../public/img/home/line.png) */

.title-bg {
  padding-left: 24px;
  height: 42px;
  width: 298px;
  background: url(../../../public/img/home/title.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
  font-size: 20px;
  font-weight: bold;
  display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
  display: -moz-box; /* Firefox 17- */
  display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
  display: -moz-flex; /* Firefox 18+ */
  display: -ms-flexbox; /* IE 10 */
  display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  align-items: center;
  margin-bottom: 20px;
}

.boxall {
  border: 1px solid #2e8b99;
  padding: 0 0 0 0;
  box-shadow: 0px 0px 25px 0px rgba(0, 138, 255, 0.4);
  background: rgba(3, 26, 49, 0.4);
  background-size: 100% auto;
  position: relative;
  z-index: 10;
}
.boxall:before,
.boxall:after {
  position: absolute;
  width: 17px;
  height: 17px;
  content: "";
  border-top: 1px solid #2e8b99;
  top: 0;
}
.boxall:before,
.boxfoot:before {
  border-left: 1px solid #2e8b99;
  left: 0;
}
.boxall:after,
.boxfoot:after {
  border-right: 1px solid #2e8b99;
  right: 0;
}
.alltitle {
  font-size: 20px;
  color: #fff;
  text-align: center;
  line-height: 20px;
}

.boxfoot {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
}
.boxfoot:before,
.boxfoot:after {
  position: absolute;
  width: 17px;
  height: 17px;
  content: "";
  border-bottom: 1px solid #2e8b99;
  bottom: 0;
}

.queryNum {
  width: 100%;
  display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
  display: -moz-box; /* Firefox 17- */
  display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
  display: -moz-flex; /* Firefox 18+ */
  display: -ms-flexbox; /* IE 10 */
  display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  justify-content: space-between;
  padding-bottom: 27px;
}
.queryNum li {
  width: 380px;
  height: 122px;
  text-align: center;
  font-weight: bold;
  display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
  display: -moz-box; /* Firefox 17- */
  display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
  display: -moz-flex; /* Firefox 18+ */
  display: -ms-flexbox; /* IE 10 */
  display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.queryNum li p:nth-child(1){
  padding-bottom: 10px;
}
.queryNum li p:nth-child(2) {
  font-size: 44px;
}
.queryNum li:nth-child(1) p {
  color: #37e961;
}
.queryNum li:nth-child(2) p {
  color: #00fffc;
}
.queryNum li:nth-child(3) p {
  color: #eb9c2a;
}
.queryNum li p:nth-child(1) {
  color: #7bcaee;
}

.boxall-border-icon {
  background: rgba(3, 26, 49, 0.4);
  border: 1px solid rgba(1, 158, 255, 1);
  box-shadow: 0px 0px 25px 0px rgba(0, 138, 255, 0.4);
  position: relative;
}
.boxall-border-icon::after {
  content: "";
  position: absolute;
  width: 50.5px;
  height: 28.7px;
  top: 5px;
  left: 4px;
  z-index: 1;
  border-top: 1px solid #019eff;
  border-left: 1px solid #019eff;
}

.boxall-border-icon::before {
  content: "";
  position: absolute;
  width: 50.5px;
  height: 28.7px;
  top: 5px;
  right: 4px;
  z-index: 1;
  border-top: 1px solid #019eff;
  border-right: 1px solid #019eff;
}

.boxallfoot {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
}

.boxallfoot:after {
  content: "";
  position: absolute;
  width: 50.5px;
  height: 28.7px;
  bottom: 5px;
  left: 4px;
  z-index: 1;
  border-bottom: 1px solid #019eff;
  border-left: 1px solid #019eff;
}
.boxallfoot:before {
  content: "";
  position: absolute;
  width: 50.5px;
  height: 28.7px;
  bottom: 5px;
  right: 4px;
  z-index: 1;
  border-bottom: 1px solid #019eff;
  border-right: 1px solid #019eff;
}

.time {
  width: 380px;
  height: 568px;
}
.tiem-box {
  display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
  display: -moz-box; /* Firefox 17- */
  display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
  display: -moz-flex; /* Firefox 18+ */
  display: -ms-flexbox; /* IE 10 */
  display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  font-weight: bold;
  font-size: 26px;
}
.tiem-box:before,
.tiem-box:after{
  content: '';
  display: block;
}

.tiem-box li {
  display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
  display: -moz-box; /* Firefox 17- */
  display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
  display: -moz-flex; /* Firefox 18+ */
  display: -ms-flexbox; /* IE 10 */
  display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  padding: 0 50px 0 20px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.tiem-box li>div:nth-child(1),
img {
  width: 42px;
  height: 42px;
}
.tiem-box li>div:nth-child(2) {
  font-size: 26px;
  padding-right: 31px;
  padding-left: 26px;
}
.tiem-box li>div:nth-child(3) {
  flex: 1;
}

.full-screen {
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 1);
  opacity: 0.6;
  border-radius: 25px;
  position: fixed;
  bottom: 10px;
  z-index: 999;
  font-size: 18px;
  color: #fff;
  left: 50%;
  margin-left: -25px;
  display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
  display: -moz-box; /* Firefox 17- */
  display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
  display: -moz-flex; /* Firefox 18+ */
  display: -ms-flexbox; /* IE 10 */
  display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  align-items: center;
  justify-content: center;
}

.full-screen img {
  width: 32px;
  height: 32px;
}

#echart2 {
  width: 669px;
  height: 357px;
}
#echart3 {
  height: 236px;
}
#echart4 {
  height: 236px;
}
</style>
