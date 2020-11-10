<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-device__deviceStatistics}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.code" placeholder="系统编码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="设备名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.mnemonicCode" placeholder="助记码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" show-summary :summary-method="getSummaries" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="code" label="系统编码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="设备名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="typeId" label="设备类型" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <div v-for="item in  deviceTypeList" :key="item.id" v-if="item.id === scope.row.typeId">
              {{ item.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceNo" label="设备编号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="manager" label="负责人" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <div v-for="item in  userList" :key="item.id" v-if="item.id === scope.row.manager">
              {{ item.realName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="总数量" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('device:devicestock:page')" type="text" size="small" @click="viewDeviceStockHandle(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { moduleRoutes } from '@/router'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      userList: [],
      deviceTypeList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/device/device/statistics'
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
  }, // 实例创建完成后被立即调用
  created () {
    this.getUserList()
    this.getDeviceList()
  },
  methods: {
    viewDeviceStockHandle (row) {
      // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
      let routeName = `${this.$route.name}__devicestock__${row.id}`
      // 否则: 添加并全局变量保存, 再跳转
      let route = {
        path: routeName,
        component: () => import(`@/views/modules/device/devicestock`),
        name: routeName,
        meta: {
          ...window.SITE_CONFIG['contentTabDefault'],
          menuId: this.$route.meta.menuId,
          title: `${row.name}-一般设备库存管理`
        }
      }
      this.$router.addRoutes([
        {
          ...moduleRoutes,
          name: `main-dynamic__${routeName}`,
          children: [route]
        }
      ])
      window.SITE_CONFIG['dynamicRoutes'].push(route)
      this.$router.push({ name: routeName, params: { 'deviceId': row.id } })
    },
    // 获取实验室列表
    getDeviceList () {
      return this.$http.get('/device/devicetype/getDeviceList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deviceTypeList = res.data
      }).catch(() => {})
    },
    // 用户列表
    getUserList: function () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {
      })
    },
    // 合计
    getSummaries (param) {
      const { columns, data } = param
      this.sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        let num = [7]
        if (num.indexOf(index) > -1) {
          this.sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (index === 5 || index === 6) {
            this.sums[index] = this.sums[index].toFixed(2)
          } else {
            this.sums[index] = this.sums[index]
          }
        }
      })
      return this.sums
    }
  }
}
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
