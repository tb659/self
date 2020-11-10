<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__waitinginstock}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-select v-model="dataForm.supplierName" clearable placeholder="供应商" style="width: 100%;">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.supplierName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.contactInformation" placeholder="联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.preparedName" placeholder="制单人" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-select v-model="dataForm.purchaseTypeName" filterable clearable placeholder="采购类型" style="width: 100%;">
            <el-option
              v-for="item in purchaseTypeList"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-select v-model="dataForm.inTypeName" filterable clearable placeholder="入库类型" style="width: 100%;">
            <el-option
              v-for="item in inTypeList"
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
        <el-form-item>
          <el-button v-if="$hasPermission('stock:waitinginstock:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="documentDate" label="单据日期" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="purchaseTypeName" label="采购类型" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="inTypeName" label="入库类型" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="supplierName" label="供应商" header-align="center" align="center" width="300"></el-table-column>
        <el-table-column prop="preparedName" label="制单人" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="documentDescription" label="单据说明" header-align="center" align="center" width="300"></el-table-column>
        <el-table-column prop="status" label="入库状态" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '2'" size="small" type="warning">部分入库</el-tag>
            <el-tag v-if="scope.row.status === '0'" size="small" type="danger">未入库</el-tag>
            <el-tag v-if="scope.row.status === '1'" size="small" type="success">已入库</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contactInformation" label="联系方式" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('stock:waitinginstock:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('stock:waitinginstock:update') && scope.row.status === '0'" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button v-if="$hasPermission('stock:waitinginstock:delete') && scope.row.status === '0'" type="text" size="small" @click="deleteHandle(scope.row.id)">{{$t('delete')}}</el-button>
            <el-button v-if="$hasPermission('stock:waitinginstock:invoicesupplement')" type="text" size="small" @click="invoiceSupplementHandle(scope.row.id)">补发票</el-button>
            <el-button v-if="$hasPermission('stock:waitinginstock:update') && scope.row.status !== '1'" type="text" size="small" @click="waitinginstockInHandle(scope.row.id)">入库</el-button>
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
      <!-- 补充发票 -->
      <invoice-supplement v-if="invoiceSupplementVisible" ref="invoiceSupplement" @refreshDataList="getDataList"></invoice-supplement>
      <!-- 入库 -->
      <waitinginstock-in v-if="waitinginstockInVisible" ref="waitinginstockIn" @refreshDataList="getDataList"></waitinginstock-in>
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './waitinginstock-add-or-update'
import WaitinginstockIn from './waitinginstock-in'
import ViewInfo from './waitinginstock-view-info'
import InvoiceSupplement from './waitinginstock-invoice-supplement'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      invoiceSupplementVisible: false,
      waitinginstockInVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/waitinginstock/waitinginstock/page',
        getDataListIsPage: true,
        exportURL: '/waitinginstock/waitinginstock/export',
        deleteURL: '/waitinginstock/waitinginstock',
        deleteIsBatch: true
      },
      daterange: null,
      supplierList: [],
      purchaseTypeList: [],
      inTypeList: [],
      dataForm: {
        id: '',
        preparedName: '',
        purchaseTypeName: '',
        inTypeName: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo, InvoiceSupplement, WaitinginstockIn
  },
  created () {
    this.getSupplierList()// 获取供应商数据
    this.getPurchaseType()// 获取采购类型
    this.getInType()
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
    getInType () {
      this.$http.get(`sys/dict/dictList`, {
        params: { dictType: 'rklx' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.inTypeList = res.data
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
    // 查看
    waitinginstockInHandle (id) {
      this.waitinginstockInVisible = true
      this.$nextTick(() => {
        this.$refs.waitinginstockIn.dataForm.id = id
        this.$refs.waitinginstockIn.init()
      })
    },
    invoiceSupplementHandle (id) {
      this.invoiceSupplementVisible = true
      this.$nextTick(() => {
        this.$refs.invoiceSupplement.dataForm.id = id
        this.$refs.invoiceSupplement.init()
      })
    }
  }

}
</script>
