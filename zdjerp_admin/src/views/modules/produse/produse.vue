<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__produse}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 200px;">
        <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
      </el-form-item>
        <el-form-item style="width: 200px;">
          <el-input v-model="dataForm.realName" placeholder="制单人" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 32%">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="申请开始日期"
            end-placeholder="申请结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('produse:produse:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('produse:produse:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="realName" label="制单人"   show-overflow-tooltip header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="totalNumber" label="出库数量" show-overflow-tooltip header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="productionUse" label="生产用途" show-overflow-tooltip header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="documentDescription" label="单据说明" show-overflow-tooltip header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="createDate" label="申请时间" show-overflow-tooltip header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.reviewStatus === 1">
              <el-button v-if="$hasPermission('produse:produse:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
              <el-button v-if="$hasPermission('produse:produse:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
              <el-button v-if="$hasPermission('produse:produse:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
              <el-button v-if="$hasPermission('produse:produse:confirm')" type="text" size="small" @click="confirmHandle(scope.row.id)">生成待出库单</el-button>
            </div>
            <div v-if="scope.row.reviewStatus !== 1">
              <el-button v-if="$hasPermission('produse:produse:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            </div>
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
import AddOrUpdate from './produse-add-or-update'
import ViewInfo from './produse-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      supplierList: [],
      warehouseList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/produse/produse/page',
        getDataListIsPage: true,
        exportURL: '/produse/produse/export',
        deleteURL: '/produse/produse',
        deleteIsBatch: true
      },
      viewInfoVisible: false,
      daterange: null,
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
    confirmHandle: function (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': '生成待出库单' }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.get(`/produse/produse/confirm/` + id).then(({ data: res }) => {
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
