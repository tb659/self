<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-salesWaiting__saleswaitingoutstock}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
   <!--     <el-form-item style="width: 180px;">
          <el-input v-model="dataForm.contractNo" placeholder="合同编号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px;">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>-->
        <el-form-item style="width: 160px;">
          <el-input v-model="dataForm.contactInformation" placeholder="联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 160px;">
          <el-input v-model="dataForm.clientUserName" placeholder="客户名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 32%">
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
      <el-table  show-summary :summary-method="getSummaries" v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
            <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
<!--        <el-table-column prop="contractNo" label="合同编号" header-align="center" align="center" show-overflow-tooltip width="180"></el-table-column>-->
        <el-table-column prop="documentNumber" label="单据编号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="documentNumberSub" label="单据子编号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectName" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="clientId" label="客户名称" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="item in customInfoList " :key="item.id" v-if="item.id === scope.row.clientId">
              {{ item.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactInformation" label="联系方式" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="出库状态" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'" size="mini" type="danger">未出库</el-tag>
            <el-tag v-if="scope.row.status === '1'" style="margin-top: 2px;" size="mini" type="success">已完成</el-tag>
            <el-tag v-if="scope.row.status === '2'" style="margin-top: 2px;" size="mini" type="warning">出库中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="allQuantity" label="总数量" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="outQuantity" label="出库数量" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="documentDate" label="单据日期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="创建日期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('salesWaiting:saleswaitingoutstock:info')" type="text" size="small" @click="viewInfo(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('salesWaiting:saleswaitingoutstock:productOutgoing')&& scope.row.status !== '1'" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">产品出库</el-button>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './saleswaitingoutstock-add-or-update'
import ViewInfo from './saleswaitingoutstock-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/salesWaiting/saleswaitingoutstock/page',
        getDataListIsPage: true,
        exportURL: '/salesWaiting/saleswaitingoutstock/export',
        deleteURL: '/salesWaiting/saleswaitingoutstock',
        deleteIsBatch: true
      },
      daterange: null,
      dataForm: {
        id: '',
        status: '',
        startDate: '',
        endDate: ''
      },
      customInfoList: []
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  created () {
    this.getCustomInfoList()
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
  methods: {
    getSummaries (param) {
      const { columns, data } = param
      this.sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        let num = [7, 8]
        if (num.indexOf(index) > -1) {
          this.sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          this.sums[index] = this.sums[index]
        }
      })
      return this.sums
    },
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
    // 获取销售合同编号
    getContractNo (row) {
      this.$http.get(`/numberRule/numberrule/searchkey/XSHTBH`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.contractNo = res.data
        this.createOrder(row)
      }).catch(() => {
      })
    },
    createOrder (row) {
      this.$http.put('/salesRequisition/salesrequisition/createContractNo', {
        'id': row.id,
        'contractNo': this.contractNo
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.getDataList()
          }
        })
      }).catch(() => {
      })
    },
    // 产品出库
    prodouctOutStorehouse (id) {
      this.viewInfoVisible = true
      this.$nextTick(() => {
        this.$refs.viewInfo.dataForm.id = id
        this.$refs.viewInfo.pageType = '1'
        this.$refs.viewInfo.init()
      })
    },
    // 重写查看方法
    viewInfo (id) {
      this.viewInfoVisible = true
      this.$nextTick(() => {
        this.$refs.viewInfo.dataForm.id = id
        this.$refs.viewInfo.pageType = '0'
        this.$refs.viewInfo.init()
      })
    }
  }
}
</script>
