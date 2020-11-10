<template>
  <div class="el-tabs__content">
    <div>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 180px;">
          <el-input v-model="dataForm.productTypeName" placeholder="产成品类型" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px;">
          <el-input v-model="dataForm.name" placeholder="系统编码/构件系列" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.projectName" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>

        <!-- 颜色提示 -->
        <div class="color-box">
          <div class="green"><span></span> 绿色:已放</div>
          <div class="blue" ><span></span> 蓝色:空余</div>
          <div class="red"  ><span></span> 红色:搜索筛选出的堆场</div>
        </div>
      </el-form>
    </div>
    <!-- 堆场 -->
    <div class="yard-content" ref="content">
      <div class="yard-item" v-for="item in dataList"  :key="item.name">
        <div class="yard-title">{{item.name}}</div>
        <div class="yard-children">
          <div
            class="yard-children-item"
            :class="[children.select?'red':children.free?'blue':'green']"
            v-for="children in item.children"
            :key="children.id+'children1'"
            @mousemove.capture="(e)=>{moveInfo(e,children.productStockInfo)}"
            @mouseleave="leaveInfo"
          >{{children.name}}
          </div>
        </div>
        <div class="yard-way">
              <div v-for="item in 7" :key="'道路'+item">道路</div>
        </div>
        <div class="yard-children">
          <div
            class="yard-children-item"
            :class="[children.select?'red':children.free?'blue':'green']"
            v-for="children in item.children"
            :key="children.id+'children2'"
            @mousemove.capture="(e)=>{moveInfo(e,children.productStockInfo)}"
            @mouseleave="leaveInfo"
          >{{children.name}}</div>
        </div>
      </div>

      <!-- 悬浮盒子 -->
        <div class="stockInfo" ref="mouseItem" v-show="mouse">
            <el-row class="stockInfo-header">
                <el-col :span="6">构件系列</el-col>
                <el-col :span="8">产成品类型</el-col>
                <el-col :span="8">适用部位</el-col>
                <el-col :span="2">数量</el-col>
            </el-row>
            <el-row class="stockInfo-item" v-for="item in productStockInfo" :key="item.componentSeries + item.componentName">
                <template v-if="item.componentName">
                   <el-col :span="6"><span>&nbsp;{{item.componentSeries}}</span></el-col>
                  <el-col :span="8"><span>&nbsp;{{item.componentName}}</span></el-col>
                  <el-col :span="8"><span>&nbsp;{{item.useSite}}</span></el-col>
                  <el-col :span="2"><span>&nbsp;{{item.quantity}}</span></el-col>
                </template>
            </el-row>
        </div>
    </div>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/product/yard/queryYardViewable'
      },
      dataForm: {
        productTypeName: '',
        name: '',
        projectName: ''
      },
      dataList: [],
      productStockInfo: [],
      mouse: false
    }
  },
  methods: {
    moveInfo (e, productStockInfo) {
      this.productStockInfo = JSON.parse(JSON.stringify(productStockInfo))
      this.mouse = true
      // el表示需要悬浮的框

      let el = this.$refs.mouseItem

      // let content = this.$refs.content
      // 根据鼠标位置定位悬浮框
      // 230 64
      el.style.left = e.clientX + 20 + 'px'
      el.style.top = e.clientY + 20 + 'px'
      // // 宽度碰撞检测
      let width = el.offsetWidth
      // console.log(e)
      if (e.clientX + width + 20 > document.documentElement.clientWidth + 20) {
        el.style.left = e.clientX - width - 20 + 'px'
      }
      // 高度碰撞检测
      let height = el.offsetHeight
      // console.log(e.clientY + height + 10)
      // console.log(document.documentElement.clientHeight)
      if (e.clientY + height + 20 > document.documentElement.clientHeight) {
        el.style.transition = '0s'
        el.style.top = e.clientY - height - 20 + 'px'
        if ((e.clientY - height - 20) + document.documentElement.clientHeight < document.documentElement.clientHeight) {
          el.style.top = e.clientY + 20 + 'px'
        }
      } else {
        el.style.transition = '1s'
      }
    },
    leaveInfo () {
      this.mouse = false
      this.productStockInfo = []
    }
  }
}
</script>
