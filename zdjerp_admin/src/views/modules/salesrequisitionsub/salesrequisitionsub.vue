<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-salesrequisitionsub__salesrequisitionsub}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 170px;">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 170px;">
          <el-input v-model="dataForm.documentNumberSub" placeholder="单据子编号" clearable></el-input>
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
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <!--<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>-->
          <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
          </el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="documentNumberSub" label="单据子编号" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="clientUserId" label="客户名称"  show-overflow-tooltip header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <div v-for="item in customInfoList " :key="item.id" v-if="item.id === scope.row.clientUserId">
              {{ item.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactInformation" label="联系方式" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <!--<el-table-column prop="createDate" label="销售时间" show-overflow-tooltip header-align="center" align="center" width="180"></el-table-column>-->
        <el-table-column prop="warehouseStatus" label="出库单状态" header-align="center" align="center" width="130">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.warehouseStatus === 1" style="margin-top: 2px;" size="mini">已生成</el-tag>
            <el-tag v-if="scope.row.warehouseStatus === 0" style="margin-top: 2px;" size="mini">未生成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="documentDate" label="单据日期" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('salesrequisitionsub:salesrequisitionsub:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('salesRequisition:salesrequisition:outboundOrder') && scope.row.warehouseStatus !== 1" type="text" size="small" @click="generatingOutBoundOrders(scope.row.id)">生成出库单</el-button>
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
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
      <salesrequistion-outstock v-if="salesrequistionOutstockVisible" ref="salesrequistionOutstock" @refreshDataList="getDataList"></salesrequistion-outstock>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './salesrequisitionsub-add-or-update'
import ViewInfo from './salesrequisitionsub-view-info'
import SalesrequistionOutstock from './salesrequisition-outstock'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      salesrequistionOutstockVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/salesrequisitionsub/salesrequisitionsub/page',
        getDataListIsPage: true,
        exportURL: '/salesrequisitionsub/salesrequisitionsub/export',
        deleteURL: '/salesrequisitionsub/salesrequisitionsub',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        documentNumber: '',
        documentNumberSub: '',
        projectName: '',
        clientUserName: '',
        startDate: '',
        endDate: ''
      },
      daterange: null,
      customInfoList: []
    }
  },
  components: {
    AddOrUpdate, ViewInfo, SalesrequistionOutstock
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
    // 生成出库单
    generatingOutBoundOrders (id) {
      this.salesrequistionOutstockVisible = true
      this.$nextTick(() => {
        this.$refs.salesrequistionOutstock.dataForm.id = id
        this.$refs.salesrequistionOutstock.init()
      })
    }
  }
}
</script>
