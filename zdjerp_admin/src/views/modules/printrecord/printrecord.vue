<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-printrecord__printrecord}">
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle">
        <el-table-column header-align="center" align="center" label="序号" width="60">
            <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="printType" label="打印类型" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.printType === 1">二维码</div>
            <div v-if="scope.row.printType === 2">二维码（小）</div>
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="操作人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="打印时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
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
import AddOrUpdate from './printrecord-add-or-update'
import ViewInfo from './printrecord-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/printrecord/printrecord/page',
        getDataListIsPage: true,
        exportURL: '/printrecord/printrecord/export',
        deleteURL: '/printrecord/printrecord',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        printId: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  created () {
    if (this.dataForm.printId === '') {
      this.dataForm.printId = this.$route.params.printId || ''
    }
  },
  activated () {
    this.getDataList()
  }
}
</script>
