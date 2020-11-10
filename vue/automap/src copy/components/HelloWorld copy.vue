<template>
  <div class="hello">
    123
    <el-button type="primary" @click="showdialogVisible">点击1</el-button>
    <!-- <el-cascader v-model="address" :options="options" @change="handleChange"></el-cascader> -->
    <!-- <el-input @blur="chooseNav" v-model="detail"></el-input> -->
    <div class="input-card" style="width: 200px">
      <h4 style="margin-bottom: 10px; font-weight: 600">利用mouseTool绘制覆盖物</h4>
      <button class="btn" @click="drawPolygon" style="margin-bottom: 5px">绘制多边形</button>
      <button class="btn" @click="drawCircle" style="margin-bottom: 5px">绘制圆形</button>
    </div>
    <div id="container" style="width:500px; height:300px"></div>
  </div>
</template>

<script>
// import axios from 'axios'
import AMap from 'AMap' // 引入高德地图
export default {
  data() {
    return {
      a: [{ a: 13, bL: '122' }],
      dialogVisible: false,
      options: [],
      address: '',
      add: '',
      detail: '',
      location: [115.621934, 33.160326],
      mouseTool: null
    }
  },
  methods: {
    showdialogVisible() {
      // this.dialogVisible = true
      console.log('1')
    },
    init() {
      var map = new AMap.Map('container', {
        center: [116.434381, 39.898515],
        zoom: 14
      })
      console.log(new AMap())
      this.mouseTool = new AMap.MouseTool(map)

      this.mouseTool.on('draw', function(event) {
        // event.obj 为绘制出来的覆盖物对象
        this.$message.success('绘制成功')
      })
    },

    drawPolygon() {
      debugger
      this.mouseTool.polygon({
        strokeColor: '#FF33FF',
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        strokeStyle: 'solid'
        // strokeStyle是dashed时有效
        // strokeDasharray: [30,10],
      })
    },

    drawCircle() {
      this.mouseTool.circle({
        strokeColor: '#FF33FF',
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        strokeStyle: 'solid'
        // 线样式还支持 'dashed'
        // strokeDasharray: [30,10],
      })
    }
  },
  mounted() {
    this.init()
    console.log('2')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
