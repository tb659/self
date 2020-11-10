<template>
  <div class="home">
    <div v-show="screenWidth >= 635">
      <div class="title">
        <img src="../../../public/img/home/001.png" alt="">
        <span>洛阳中电建大数据中心</span>
        <img src="../../../public/img/home/002.png" alt="">
      </div>
      <div class="time">
        <i class="el-icon-time"></i>
        <span class="span">{{realTime}}</span>
      </div>
    </div>
    <div v-show="screenWidth < 635">
      <div class="title">
        <span>洛阳中电建大数据中心</span>
      </div>
      <div class="time">
        <i class="el-icon-time"></i>
        <span class="span">{{realTime}}</span>
      </div>
    </div>
    <el-row class="elRow">
      <el-col :xs="24"  :sm="9"   :md="8" :lg="6"  :xl="5">
        <div class="Total">
          <img src="../../../public/img/home/003.png" alt="">
          <div  class="totalContent">
            <div class="textTitle">总生产产品数量</div>
            <div class="content">
              <span v-for="item in allProductQuantity" :key="item">{{item}}</span>
            </div>
          </div>
         </div>
      </el-col>
      <el-col :xs="11"  :sm="6"   :md="8" :lg="12"  :xl="14" class="elColTwo">
        <el-row>
          <el-col :xs="24" :md="24"  :lg="8" :xl="8">
            <div class="div">
              <div class="divOne">
                <img src="../../../public/img/home/rate2.png" alt="">
              </div>
              <div class="Textone">今日预生产总数
                <p>{{numbers.totalPreProductionToday}}</p>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :md="24" :lg="8" :xl="8">
            <div class="div">
              <div class="divOne">
                <img src="../../../public/img/home/rate1.png" alt="">
              </div>
              <div class="Textone">今日生产完成总数
                <p>{{numbers.totalProductionCompletedToday}}</p>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :md="24"  :lg="8" :xl="8">
            <div class="div">
              <div class="divOne">
                <img src="../../../public/img/home/rate.png" alt="">
              </div>
              <div class="Textone">今日发货总数
                <p>{{numbers.totalShipmentsToday}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
       </el-col>
      <el-col :xs="13"  :sm="9"   :md="8" :lg="6"  :xl="5" class="elColThree">
          <radar-chart></radar-chart>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="9" :lg="7" :xl="6">
        <line-chart></line-chart>
      </el-col>
      <el-col :xs="24" :sm="15" :lg="11" :xl="12" class="myChart" v-if="screenWidth >= 1560">
        <center-chart></center-chart>
      </el-col>
      <el-col :xs="24" :sm="15" :lg="11" :xl="12" class="myChart" v-if="screenWidth<1560 && screenWidth>= 1200">
        <center-chartsmall></center-chartsmall>
      </el-col>
      <el-col :xs="24" :sm="15" :lg="11" :xl="12" class="smallChart" v-if="screenWidth < 1200">
        <center-chartsmall></center-chartsmall>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6" :xl="6">
        <rank-chart></rank-chart>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24"  :sm="24"   :lg="5"  :xl="6">
        <table-one></table-one>
      </el-col>
      <el-col :xs="24"  :sm="24"  :lg="14"  :xl="12" class="infoClass">
        <info-chart></info-chart>
      </el-col>
      <el-col :xs="24" :sm="24"  :lg="5"  :xl="6">
        <over-chart></over-chart>
      </el-col>
    </el-row>
   </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css'
import RadarChart from '../../components/echartsCircle'
import LineChart from '../../components/echartsLine'
import RankChart from '../../components/echartsLine-rank'
import CenterChart from '../../components/echartsCenter'
import CenterChartsmall from '../../components/echartsCenterSmall'

import TableOne from '../../components/tableOne'
import InfoChart from '../../components/echartsClass'
import OverChart from '../../components/echartsOver'

export default {
  name: 'chart',
  components: { RadarChart, LineChart, RankChart, TableOne, InfoChart, OverChart, CenterChart, CenterChartsmall },
  data () {
    return {
      allProductQuantity: [],
      numbers: {},
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      realTime: '',
      timer: null
    }
  },
  // el挂载到实例上后调用，一般我们的第一个业务逻辑会在这里开始
  mounted: function () {
    // 页面加载完后显示当前时间
    this.realTime = this.dealWithTime(new Date())
    // 定时刷新时间
    let _this = this
    // 定时器
    this.timer = setInterval(function () {
      _this.realTime = _this.dealWithTime(new Date()) // 修改数据date
    }, 10 * 1000)
  },
  // 注意在vue实例销毁前，清除我们的定时器。
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  created () {
    this.getAllProductQuantity()
    this.getNumbers()
  },
  methods: {
    getAllProductQuantity () {
      this.$http.get(`/bigscreen/bigscreen/getAllProductQuantity`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        var number = res.data
        var sNumber = number.toString()
        for (var i = 0, len = sNumber.length; i < len; i += 1) {
          this.allProductQuantity.push(+sNumber.charAt(i))
        }
      })
    },
    getNumbers () {
      this.$http.get(`/bigscreen/bigscreen/getNumbers`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.numbers = res.data
      })
    },
    dealWithTime (data) {
      let formatDateTime
      let Y = data.getFullYear()
      let M = data.getMonth() + 1
      let D = data.getDate()
      let H = data.getHours()
      let Min = data.getMinutes()
      let S = data.getSeconds()
      let W = data.getDay()
      H = H < 10 ? ('0' + H) : H
      Min = Min < 10 ? ('0' + Min) : Min
      S = S < 10 ? ('0' + S) : S
      switch (W) {
        case 0:
          W = '天'
          break
        case 1:
          W = '一'
          break
        case 2:
          W = '二'
          break
        case 3:
          W = '三'
          break
        case 4:
          W = '四'
          break
        case 5:
          W = '五'
          break
        case 6:
          W = '六'
          break
        default:
          break
      }
      formatDateTime = Y + '年' + M + '月' + D + '日 ' + H + ' : ' + Min + ' : ' + S + ' 星期' + W
      return formatDateTime
    }
  }
}
</script>

<style scoped>
  *{
    margin:0px;
    padding:0px;
  }
  /*整个页面的父元素*/
  .home{
    background: url('../../../public/img/home/bg3.png');
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    width:100%;
    height:100%;
    font-family:PingFang SC ;
    padding:1.8rem 2rem 1rem;
    position: relative;

    }
  /*页面大标题*/
.title{
  color: #ffffff;
  font-size:22px;
  font-weight: bold;
  text-align: center;
}
/*标题两边图片*/
.title img{
  width:23%;
}
/*标题文字*/
.title span{
padding:0px 2.5rem;
}
  /*页面右上角的时间和图标*/
  .time{
    color:#fff;
    position:absolute;
    top:0.8rem;
    right:2rem;
  }
  /*页面右上角的时间*/
  .span{
    padding-left:0.4rem;
    font-size:13px;
  }
  /*内容第一栏的联网单位总数量*/
  .elRow{
   margin-top:1rem;
  }
  /*总数量的父元素*/
  .Total{
    position:relative;
  }
  /*背景图-联网单位总数量*/
  .Total img{
    width:100%;
    height: 16rem;
   }
  /*图片上的文本*/
  .totalContent{
    position:absolute;
    top:5%;
    left:4%;
    width:91%;
   }
  /*图片最上边的文字*/
  .textTitle{
    color:#2b94dc;
    font-size:0.9rem;
    font-weight: bold;
  }
  /*总数量的显示*/
  .content{
    color:#b2c2c8;
    text-align: center;
    margin-top:24%;
  }
  .content span{
    font-size:30px;
    padding:0px 2.5%;
    margin-left:1.5%;
    margin-right:1.5%;
    background:linear-gradient(to bottom,#002c6d,#002b4d);
  }
  .elColTwo{
    text-align: center;
    margin-top:1rem;
  }
  .elColTwo img{
    width:80px;
    /*margin-left:2rem;*/
  }
  .div{
    display: flex;
    justify-content: center;
  }
.Textone{
color: #fff;
  font-size:12px;
  padding-top:1.2rem;
}
  .Textone p{
    color:#2b94dc;
    font-size:22px;
    margin-top:0.3rem;
  }
  .myChart{
    margin-top:-9%;
  }
  .smallChart{
    margin-top:0%;
  }
.infoClass{
  margin-top:0.5rem;
}
</style>
