<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-checkingMenu__checkingmenu}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="$hasPermission('checkingMenu:checkingmenu:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" row-key="id" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column prop="checkName" label="检查内容名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="checkType" label="类型" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.checkType === '1'" size="small" >单选</el-tag>
            <el-tag v-if="scope.row.checkType === '2'" size="small" >输入框</el-tag>
            <el-tag v-if="scope.row.checkType === '3'" size="small" >下拉框</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('checkingMenu:checkingmenu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('checkingMenu:checkingmenu:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './checkingmenu-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: false,
        getDataListURL: '/checkingMenu/checkingmenu/list',
        exportURL: '/checkingMenu/checkingmenu/export',
        deleteURL: '/checkingMenu/checkingmenu',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        deviceId: ''
      }
    }
  },
  activated () {
    if (this.dataForm.deviceId === '') {
      this.dataForm.deviceId = this.$route.params.deviceId || ''
      if (this.dataForm.deviceId !== '') {
        this.mixinViewModuleOptions.getDataListURL = '/checkingMenu/checkingmenu/list'
      }
    } else {
      this.$route.params.deviceId = this.dataForm.deviceId
    }
    this.getDataList()
  },
  components: {
    AddOrUpdate
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
