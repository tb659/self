<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-maintainMenu__maintainmenu}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="$hasPermission('maintainMenu:maintainmenu:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" row-key="id" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column prop="maintainName" label="保养内容名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="maintainType" label="类型" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.maintainType === '1'" size="small" >单选</el-tag>
            <el-tag v-if="scope.row.maintainType === '2'" size="small" >输入框</el-tag>
            <el-tag v-if="scope.row.maintainType=== '3'" size="small" >下拉框</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('maintainMenu:maintainmenu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('maintainMenu:maintainmenu:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './maintainmenu-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: false,
        getDataListURL: '/maintainMenu/maintainmenu/list',
        exportURL: '/maintainMenu/maintainmenu/export',
        deleteURL: '/maintainMenu/maintainmenu',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        deviceId: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    if (this.dataForm.deviceId === '') {
      this.dataForm.deviceId = this.$route.params.deviceId || ''
      if (this.dataForm.deviceId !== '') {
        this.mixinViewModuleOptions.getDataListURL = '/maintainMenu/maintainmenu/list'
      }
    } else {
      this.$route.params.deviceId = this.dataForm.deviceId
    }
    this.getDataList()
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.dataForm.deviceId = this.dataForm.deviceId
        this.$refs.addOrUpdate.init()
      })
    }
  }
}
</script>
