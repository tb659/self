<template>
  <div class="hello">
    <el-button type="primary" @click="showdialogVisible">点击</el-button>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <span>这是一段信息</span>
      <div id="container" style="width:500px; height:300px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AMap from 'AMap' // 引入高德地图
export default {
  data() {
    return {
      a: [{ a: 13, bL: '122' }],
      dialogVisible: false
    }
  },
  methods: {
    showdialogVisible() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.init()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    init() {
      const map = new AMap.Map('container', {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 10
      })
      console.log(map)
    }
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
