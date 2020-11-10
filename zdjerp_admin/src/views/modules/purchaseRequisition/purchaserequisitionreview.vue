<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__purchaserequisition}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
<!--        <el-form-item  style="width: 190px">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>-->
        <el-form-item  style="width: 190px">
          <el-select v-model="dataForm.supplierName" clearable placeholder="供应商" style="width: 100%;">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.supplierName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  style="width: 190px">
          <el-input v-model="dataForm.contactInformation" placeholder="联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item  style="width: 190px">
          <el-input v-model="dataForm.preparedName" placeholder="制单人" clearable></el-input>
        </el-form-item>
        <el-form-item  style="width: 190px">
          <el-select v-model="dataForm.purchaseTypeName" filterable clearable placeholder="采购类型" style="width: 100%;">
            <el-option
              v-for="item in purchaseTypeList"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 350px;">
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
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
       <!-- <el-table-column prop="documentNumber" label="单据编号" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>-->
        <el-table-column prop="supplierId" label="供应商" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <div v-for="item in  supplierList" :key="item.id" v-if="item.id === scope.row.supplierId">
              {{ item.supplierName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactInformation" label="联系方式" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="realName" label="制单人" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="purchaseTypeName" label="采购类型" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="reviewStatus" label="审核状态" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.reviewStatus === 1" size="small" type="warning">未提交审核</el-tag>
            <el-tag v-if="scope.row.reviewStatus === 2" size="small" type="info">审核中</el-tag>
            <el-tag v-if="scope.row.reviewStatus === 3" size="small" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.reviewStatus === 4" size="small" type="danger">审核驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalNumber" label="总数量" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="documentDate" label="单据日期" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('purchaserequisition:purchaserequisition:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('purchaserequisition:purchaserequisition:pass') && scope.row.reviewStatus === 2" type="text" size="small" @click="confirmHandle(scope.row.id,1)">审核</el-button>
            <el-button v-if="$hasPermission('purchaserequisition:purchaserequisition:pass') && scope.row.reviewStatus === 2" type="text" size="small" @click="confirmHandle(scope.row.id,2)">立即通过</el-button>
            <el-button v-if="$hasPermission('purchaserequisition:purchaserequisition:unpass') && scope.row.reviewStatus === 2" type="text" size="small" @click="unpassHandle(scope.row.id)">驳回</el-button>
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
      <view-info v-if="viewInfoVisible" @refreshDataList="getDataList" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './purchaserequisition-add-or-update'
import ViewInfo from './purchaserequisition-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      purchaseTypeList: [],
      supplierList: [],
      warehouseList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/purchaserequisition/purchaserequisition/page',
        getDataListIsPage: true,
        exportURL: '/purchaserequisition/purchaserequisition/export',
        deleteURL: '/purchaserequisition/purchaserequisition',
        deleteIsBatch: true
      },
      daterange: null,
      viewInfoVisible: false,
      dataForm: {
        id: '',
        financialStatus: 'true',
        startDate: '',
        endDate: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  created () {
    this.getSupplierList()// 获取存放种类数据
    this.getWarehouseList()// 获取库房数据
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
    // 查看
    viewInfoHandle (id) {
      this.viewInfoVisible = true
      this.$nextTick(() => {
        this.$refs.viewInfo.dataForm.id = id
        this.$refs.viewInfo.dataForm.ispass = 1 // 点击查看传入的参数
        this.$refs.viewInfo.init()
      })
    },
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
    confirmHandle: function (id, type) {
      if (type === 1) {
        this.viewInfoVisible = true
        this.$nextTick(() => {
          this.$refs.viewInfo.dataForm.id = id
          this.$refs.viewInfo.dataForm.ispass = 2 // 点击通过传入的参数
          this.$refs.viewInfo.init()
        })
      } else {
        this.$http.get(`/purchaserequisition/purchaserequisition/pass/` + id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500
          })
          this.getDataList()
        }).catch(() => {
        })
      }
    },
    unpassHandle: function (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': '驳回' }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.get(`/purchaserequisition/purchaserequisition/unpass/` + id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500
          })
          this.getDataList()
        }).catch(() => {
        })
      }).catch(() => {})
    }
  }
}
</script>
