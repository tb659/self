<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-salesRequisition__salesStatistics}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.contractNo" placeholder="合同编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
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
      <el-table v-loading="dataListLoading" show-summary :summary-method="getSummaries"  :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="contractNo" label="合同编号" show-overflow-tooltip header-align="center" align="center" width="180px"></el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" show-overflow-tooltip header-align="center" align="center" width="180px"></el-table-column>
        <el-table-column prop="documentDate" label="单据日期" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="clientUserId" label="客户名称"  show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <div v-for="item in customInfoList " :key="item.id" v-if="item.id === scope.row.clientUserId">
              {{ item.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactInformation" label="联系方式"  show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="totalNumber" label="总数量" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="totalTaxAmount" label="总含税金额" show-overflow-tooltip header-align="center" align="center"></el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/salesRequisition/salesStatistics/page'
      },
      daterange: null,
      dataForm: {
        id: '',
        contractNo: '',
        startDate: '',
        endDate: ''
      },
      contractNo: '',
      customInfoList: []
    }
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
    getSummaries (param) {
      const { columns, data } = param
      this.sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        let num = [6, 7, 8]
        if (num.indexOf(index) > -1) {
          this.sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (index === 8 || index === 7) {
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
