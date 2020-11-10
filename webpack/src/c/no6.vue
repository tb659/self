<template>
 <div>
  <div class="projectmap">
   <div class="title">项目分布图</div>
   <div id="allmap" ref="allmap"></div>
  </div>
 </div>
</template>

<script>
 import BMap from 'BMap'
 export default {
  name: 'project-map',
  methods: {
   map() {
    let map = new BMap.Map(this.$refs.allmap) // 创建Map实例
    map.centerAndZoom('北京', 15) // 初始化地图,用城市名设置地图中心点
    map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
   }
  },
  mounted() {
   this.map()
  }

 }
</script>

<style scoped>
 .projectmap {
  margin: 50px auto 100px;
  height: 505px;
  /*width: 880px;*/
 }
 
 #allmap {
  width: 1200px;
  height: 505px;
  overflow: hidden;
  margin: 0 auto;
 }
 
 .title {
  height: 18px;
  line-height: 18px;
  color: #fff;
  font-family: 微软雅黑;
  font-size: 18px;
  margin: 0 0 15px 0;
 }
</style>