<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-salesRequisition__salesrequisition}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 170px;">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 170px;">
          <el-input v-model="dataForm.projectName" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 170px;">
          <el-input v-model="dataForm.clientUserName" placeholder="客户名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 28%">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="单据开始日期"
            end-placeholder="单据结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('salesRequisition:salesrequisition:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('salesRequisition:salesrequisition:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" :selectable="checkBoxChecked" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" show-overflow-tooltip header-align="center" align="center" width="180"></el-table-column>
        <el-table-column prop="clientUserId" label="客户名称"  show-overflow-tooltip header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <div v-for="item in customInfoList " :key="item.id" v-if="item.id === scope.row.clientUserId">
              {{ item.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactInformation" label="联系方式"  show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"  show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="createDate" label="销售时间" show-overflow-tooltip header-align="center" align="center" width="180"></el-table-column>
        <el-table-column prop="" label="状态" header-align="center" align="center" width="130">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.productionStatus === 1" style="margin-top: 2px;" size="mini">已生成生产订单</el-tag>
            <el-tag v-if="scope.row.warehouseStatus === 1" style="margin-top: 2px;" size="mini">已生成出库单</el-tag>
            <el-tag v-if="scope.row.warehouseStatus === 2" style="margin-top: 2px;" size="mini">部分生成出库单</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="documentDate" label="单据日期" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('salesRequisition:salesrequisition:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('salesRequisition:salesrequisition:update') && scope.row.productionStatus === 0 && scope.row.warehouseStatus === 0" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('salesRequisition:salesrequisition:delete') && scope.row.productionStatus === 0 && scope.row.warehouseStatus === 0" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
            <el-button v-if="$hasPermission('productionorders:productionorders:save') && scope.row.productionStatus === 0" type="text" size="small" @click="generatingProductionOrders(scope.row)">生成生产申请订单</el-button>
            <el-button v-if="$hasPermission('salesRequisition:salesrequisition:outboundOrder') && scope.row.warehouseStatus !== 1" type="text" size="small" @click="generatingOutBoundOrders(scope.row.id)">生成待出库单</el-button>
            <el-button v-if="$hasPermission('contract:contract:page')" type="text" size="small" @click="contractManage(scope.row)">合同管理</el-button>
            <el-button v-if="$hasPermission('salesRequisition:salesrequisition:download') && scope.row.enclosureUrl" type="text" size="small" @click="downloadHandle(scope.row)">下载合同</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo" @refreshDataList="getDataList"></view-info>
      <!--附件上传-->
      <enclosure-file v-if="enclosureUrlVisible" ref="enclosureFile" @setEnclosureInfo="setEnclosureUrl"></enclosure-file>
      <!-- 生成待出库单 -->
      <salesrequistion-sub v-if="salesrequistionSubVisible" ref="salesrequistionSub" @refreshDataList="getDataList"></salesrequistion-sub>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './salesrequisition-add-or-update'
import ViewInfo from './salesrequisition-view-info'
import SalesrequistionSub from './salesrequisition-sub'
import EnclosureFile from './salesrequisition-upload'
import { moduleRoutes } from '@/router'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      salesrequistionSubVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/salesRequisition/salesrequisition/page',
        getDataListIsPage: true,
        exportURL: '/salesRequisition/salesrequisition/export',
        deleteURL: '/salesRequisition/salesrequisition',
        deleteIsBatch: true
      },
      daterange: null,
      dataForm: {
        id: '',
        contractNo: '',
        clientUserName: '',
        startDate: '',
        endDate: ''
      },
      contractNo: '',
      enclosureUrlVisible: false,
      customInfoList: []
    }
  },
  components: {
    AddOrUpdate, ViewInfo, EnclosureFile, SalesrequistionSub
  },
  watch: {
    daterange (val) {
      if (val != null) {
        this.dataForm.startDate = val[0] + ' 00:00:00'
        this.dataForm.endDate = val[1] + ' 23:59:59'
      } else {
        this.dataForm.startDate = ''
        this.dataForm.endDate = ''
      }
    }
  },
  created () {
    this.getCustomInfoList()
  },
  methods: {
    checkBoxChecked (row, index) {
      if (row.contractNo !== '') {
        return false// 禁用
      } else {
        return true// 不禁用
      }
    },
    // 客户列表
    getCustomInfoList: function () {
      this.$http.get(`/salesRequisition/salesrequisition/findAllCustomlist`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.customInfoList = res.data
      }).catch(() => {
      })
    },
    // 下载
    downloadHandle (row) {
      window.open(row.enclosureUrl)
    },
    // 获取文件的信息
    setEnclosureUrl (row) {
      this.dataListLoading = true
      this.getContractNo(row)
    },
    // 获取销售合同编号
    getContractNo (row) {
      this.$http.get(`/numberRule/numberrule/searchkey/XSHTBH`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.contractNo = res.data
        this.createOrder(row)
      }).catch(() => {})
    },
    createOrder (row) {
      this.$http.put('/salesRequisition/salesrequisition/createContractNo', {
        'id': row.get('id'),
        'contractNo': this.contractNo
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.setUrl(row)
      }).catch(() => {
      })
    },
    setUrl (row) {
      this.$http.put('/salesRequisition/salesrequisition/enclosureUrl', {
        'id': row.get('id'),
        'enclosureUrl': row.get('src')
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.dataListLoading = false
            this.getDataList()
          }
        })
      }).catch(() => {
      })
    },
    generatingProductionOrders (row) {
      this.$http.post(`/productionorders/productionorders`, {
        id: row.id
      }).then(({ data: res }) => {
        if (res.code !== 0 && res.code !== 2) {
          return this.$message.error(res.msg)
        }
        if (res.code === 2) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 2000,
            onClose: () => {
              this.getDataList()
            }
          })
          return
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.getDataList()
          }
        })
      }).catch(() => {})
    },
    // 生成出库单
    generatingOutBoundOrders (id) {
      this.salesrequistionSubVisible = true
      this.$nextTick(() => {
        this.$refs.salesrequistionSub.dataForm.id = id
        this.$refs.salesrequistionSub.init()
      })
    },
    contractHandle (row) {
      this.enclosureUrlVisible = true
      this.$nextTick(() => {
        this.$refs.enclosureFile.id = row.id
        this.$refs.enclosureFile.init()
      })
    },
    contractManage (row) {
      // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
      var routeName = `${this.$route.name}__${row.id}`
      var route = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
      if (route) {
        return this.$router.push({ name: routeName, params: { 'orderId': row.id, 'type': 1 } })
      }
      // 否则: 添加并全局变量保存, 再跳转
      route = {
        path: routeName,
        component: () => import(`@/views/modules/contract/contract`),
        name: routeName,
        meta: {
          ...window.SITE_CONFIG['contentTabDefault'],
          menuId: this.$route.meta.menuId,
          title: row.projectName + ` - 合同管理`
        }
      }
      this.$router.addRoutes([
        {
          ...moduleRoutes,
          name: `main-dynamic__${route.name}`,
          children: [route]
        }
      ])
      window.SITE_CONFIG['dynamicRoutes'].push(route)
      this.$router.push({ name: route.name, params: { 'orderId': row.id, 'type': 1 } })
    }
  }
}
</script>
