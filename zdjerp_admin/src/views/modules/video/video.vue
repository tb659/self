<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-video__video}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.ip" placeholder="ip" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.port" placeholder="端口" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('video:video:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('video:video:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="url" label="监控地址" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="ip" label="ip" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="port" label="端口" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="pwd" label="密码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('video:video:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('video:video:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('video:video:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './video-add-or-update'
import ViewInfo from './video-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/video/video/page',
        getDataListIsPage: true,
        exportURL: '/video/video/export',
        deleteURL: '/video/video',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  }
}
</script>
