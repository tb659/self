<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__purchasewarehousingrecord}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-select v-model="dataForm.supplierName" clearable placeholder="供应商" style="width: 100%;">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.supplierName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.contactInformation" placeholder="联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-select v-model="dataForm.purchaseTypeName" filterable clearable placeholder="采购类型" style="width: 100%;">
            <el-option
              v-for="item in purchaseTypeList"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.creatorName" placeholder="入库操作人" clearable></el-input>
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
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="supplierName" label="供应商" header-align="center" align="center"  width="300"></el-table-column>
        <el-table-column prop="contactInformation" label="联系方式" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="purchaseTypeName" label="采购类型" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="materials" label="采购物品" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="allPrice" label="金额" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="documentDate" label="单据日期" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="quantity" label="入库总数量" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="creatorName" label="入库操作人" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="createDate" label="创建日期" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('purchasewarehousingrecord:purchasewarehousingrecord:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
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
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './purchasewarehousingrecord-add-or-update'
import ViewInfo from './purchasewarehousingrecord-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      purchaseTypeList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/purchasewarehousingrecord/purchasewarehousingrecord/page',
        getDataListIsPage: true,
        exportURL: '/purchasewarehousingrecord/purchasewarehousingrecord/export',
        deleteURL: '/purchasewarehousingrecord/purchasewarehousingrecord',
        deleteIsBatch: true
      },
      daterange: null,
      supplierList: [],
      dataForm: {
        id: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  created () {
    this.getSupplierList()// 获取供应商数据
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
        this.$refs.viewInfo.init()
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
    }
  }
}
</script>
