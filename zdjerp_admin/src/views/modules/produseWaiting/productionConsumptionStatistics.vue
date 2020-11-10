<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-produseWaiting__productionConsumptionStatistics}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="物料编号/名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="daterange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" show-summary :summary-method="getSummaries" :data="dataList" border style="width: 100%;">
          <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
          </el-table-column>
        <el-table-column prop="materialCoding" label="物料编号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="materialName" label="物料名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="specificationType" label="规格型号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="deptName" label="单位" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="quantity" label="数量" show-overflow-tooltip header-align="center" align="center"></el-table-column>
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
        getDataListURL: '/produseRecord/prodconstatistics/queryStatistics'
      },
      daterange: null,
      dataForm: {
        name: '',
        startDate: '',
        endDate: ''
      }
    }
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
          this.sums[index] = this.sums[index]
        }
      })
      return this.sums
    }
  }
}
</script>
