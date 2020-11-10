<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-securityProduction__securityproduction}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.title" placeholder="标题" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.publisher" placeholder="发布人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.type" clearable placeholder="请选择类型">
            <el-option label="整改通知" value="1"></el-option>
            <el-option label="安全培训" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker style="width: 100%"
                          v-model="dataForm.publishDate"
                          type="date"
                          placeholder="发布日期"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('securityProduction:securityproduction:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('securityProduction:securityproduction:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="digest" label="摘要" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="thumbnail" label="缩略图" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
              <img :src="scope.row.thumbnail" alt="" style="width: 150px;height: 150px">
              <img slot="reference" :src="scope.row.thumbnail" style="width: 30px;height: 30px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="publisher" label="发布人" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1" size="small">整改通知</el-tag>
            <el-tag v-if="scope.row.type === 2" size="small">安全培训</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishDate" label="发布日期" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('securityProduction:securityproduction:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('securityProduction:securityproduction:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('securityProduction:securityproduction:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './securityproduction-add-or-update'
import ViewInfo from './securityproduction-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/securityProduction/securityproduction/page',
        getDataListIsPage: true,
        exportURL: '/securityProduction/securityproduction/export',
        deleteURL: '/securityProduction/securityproduction',
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
