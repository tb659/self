<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__produse}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="workshopName" label="车间" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="prodline" label="生产线" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="teamName" label="生产班组" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="realName" label="制单人"   show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="totalNumber" label="入库数量" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="申请时间" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.reviewStatus === 2">
              <el-button v-if="$hasPermission('produse:produse:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
              <el-button v-if="$hasPermission('produse:produse:confirm')" type="text" size="small" @click="confirmHandle(scope.row.id)">出库</el-button>
            </div>
            <div v-if="scope.row.reviewStatus === 3">
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
      dataForm: {
        id: '',
        financialStatus: 'true'
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
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
      this.$confirm(this.$t('prompt.info', { 'handle': '提交审核' }), this.$t('prompt.title'), {
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
