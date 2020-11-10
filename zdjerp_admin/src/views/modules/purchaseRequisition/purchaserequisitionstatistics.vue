<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__purchaserequisition}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item  style="width: 180px;">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px;">
          <el-select v-model="dataForm.supplierName" clearable placeholder="供应商" style="width: 100%;">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.supplierName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  style="width: 180px;">
          <el-input v-model="dataForm.contactInformation" placeholder="联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px;">
          <el-input v-model="dataForm.preparedName" placeholder="制单人" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px;">
          <el-select v-model="dataForm.purchaseTypeName" filterable clearable placeholder="采购类型" style="width: 100%;">
            <el-option
              v-for="item in purchaseTypeList"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" show-summary :summary-method="getSummaries" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" show-overflow-tooltip header-align="center" align="center" width="180px"></el-table-column>
        <el-table-column prop="supplierId" label="供应商" show-overflow-tooltip header-align="center" align="center" width="300px">
          <template slot-scope="scope">
            <div v-for="item in  supplierList" :key="item.id" v-if="item.id === scope.row.supplierId">
              {{ item.supplierName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactInformation" label="联系方式"  show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="purchaseTypeName" label="采购类型"   show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="realName" label="制单人"   show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="totalNumber" label="总数量" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="totalAmount" label="金额" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="totalTaxAmount" label="含税金额" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="createDate" label="申请时间" show-overflow-tooltip header-align="center" align="center" width="180px"></el-table-column>
      </el-table>
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
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
      warehouseList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/purchaserequisitionstatistics/purchaserequisitionstatistics/queryStatistics'
      },
      dataForm: {
        id: ''
      }
    }
  },
  created () {
    this.getSupplierList()// 获取存放种类数据
    this.getWarehouseList()// 获取库房数据
    this.getPurchaseType()// 获取采购类型
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
    // 库房列表
    getWarehouseList: function () {
      this.$http.get(`/basis/storeroom/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseList = res.data
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
          if (index === 7 || index === 8) {
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
