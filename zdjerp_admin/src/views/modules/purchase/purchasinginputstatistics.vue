<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__purchasewarehousing}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="编码/名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-select v-model="dataForm.purchaseType" clearable placeholder="采购类型">
            <el-option
              v-for="item in purchaseTypeList"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-select v-model="dataForm.supplierId" filterable clearable placeholder="供应商">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.supplierName"
              :value="item.id">
            </el-option>
          </el-select>
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
      <el-table v-loading="dataListLoading" :data="dataList" show-summary :summary-method="getSummaries" border style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="materialCoding" label="编码" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="materialName" label="名称" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="purchaseTypeName" label="采购类型" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="supplierName" label="供应商" show-overflow-tooltip header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="quantity" label="入库数量" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="amount" label="总金额" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="remark" label="单据说明" header-align="center" align="center" width="300"></el-table-column>
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
      purchaseTypeList: [],
      supplierList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/purchasinginput/purchasinginput/queryStatistics'
      },
      daterange: null,
      dataForm: {
        id: '',
        name: '',
        purchaseType: '',
        supplierId: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  created () {
    this.getSupplierList()// 获取供应商
    this.getPurchaseType()// 获取采购类型
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
    // 供应商列表
    getSupplierList: function () {
      this.$http.get(`/supplier/supplier/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.supplierList = res.data
      }).catch(() => {
      })
    },
    // 获取采购类型列表
    getPurchaseType () {
      this.$http.get(`sys/dict/dictList`, {
        params: { dictType: 'purchaseType' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.purchaseTypeList = res.data
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
        let num = [5, 7]
        if (num.indexOf(index) > -1) {
          this.sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
      })
      return this.sums
    }

  }
}
</script>
