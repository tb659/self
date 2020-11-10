<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-contract__contract}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="$hasPermission('contract:contract:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
            <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="contractNo" label="合同编号" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column prop="name" label="合同名称" header-align="center" align="center" show-overflow-tooltip width="250"></el-table-column>
        <el-table-column prop="createName" label="上传人" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="createDate" label="上传时间" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column prop="remark" label="合同描述" header-align="center" align="center" show-overflow-tooltip width="300"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="downloadHandle(scope.row.enclosureUrl)">下载</el-button>
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
import AddOrUpdate from './contract-add-or-update'
import ViewInfo from './contract-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/contract/contract/page',
        getDataListIsPage: true,
        exportURL: '/contract/contract/export',
        deleteURL: '/contract/contract',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        orderId: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  created () {
    if (this.dataForm.orderId === '') {
      this.dataForm.orderId = this.$route.params.orderId || ''
      this.dataForm.type = this.$route.params.type || ''
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.dataForm.orderId = this.dataForm.orderId
        this.$refs.addOrUpdate.dataForm.type = this.dataForm.type
        this.$refs.addOrUpdate.init()
      })
    },
    // 下载
    downloadHandle (enclosureUrl) {
      window.open(enclosureUrl)
    }
  }
}
</script>
