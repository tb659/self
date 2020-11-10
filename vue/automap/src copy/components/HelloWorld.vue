<template>
  <div class="hello">
    123
    <el-button type="primary" @click.stop="showdialogVisible">点击1</el-button>
    <!-- <el-cascader v-model="address" :options="options" @change="handleChange"></el-cascader> -->
    <!-- <el-input @blur="chooseNav" v-model="detail"></el-input> -->
    <div class="input-card" style="width: 200px">
      <h4 style="margin-bottom: 10px; font-weight: 600">利用mouseTool绘制覆盖物</h4>
      <button class="btn" @click.stop="drawPolygon" style="margin-bottom: 5px">绘制多边形</button>
      <button @click.stop="polyEditor.open()">开始编辑多边形</button>
    </div>
    <div id="container" style="width:500px; height:300px" @click.stop="drowMarker"></div>
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
      mouseTool: null,
      polyEditor: null,
      polygon: null,
      pathList: [],
      isDrowPath: 0
    }
  },
  methods: {
    showdialogVisible() {
      // this.dialogVisible = true
      console.log('1')
    },
    init() {
      var that = this
      var map = new AMap.Map('container', {
        center: this.location,
        zoom: 14
      })

      // this.polygon = new AMap.Polygon({
      //   path: that.pathList,
      //   strokeColor: '#FF33FF',
      //   strokeWeight: 6,
      //   strokeOpacity: 0.2,
      //   fillOpacity: 0.4,
      //   fillColor: '#1791fc',
      //   zIndex: 50
      // })

      this.mouseTool = new AMap.MouseTool(map)
      // this.polyEditor = new AMap.PolyEditor(map, this.polygon)

      this.mouseTool.on('draw', event => {
        // event.obj 为绘制出来的覆盖物对象
        this.$message.success('绘制成功')
        this.isDrowPath = 10000000000
      console.log(this.isDrowPath)

        // console.log(this.mouseTool)
      })
      AMap.event.addListener(this.mouseTool, 'draw', e => {
        // console.log(e.obj.getPath()) //获取路径/范围
        const pathList = e.obj.getPath()
        pathList.map(item => {
          that.pathList.push([item.lng, item.lat])
        })
        console.log(this.pathList)
      })
    },

    drawPolygon() {
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

    drowMarker() {
      this.isDrowPath += 1
      console.log(this.isDrowPath)
      if (this.isDrowPath == 10000000002) {
        this.mouseTool.close()
        return this.$message.warning('区域范围已存在')
      }
    }
  },
  mounted() {
    this.init()
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
