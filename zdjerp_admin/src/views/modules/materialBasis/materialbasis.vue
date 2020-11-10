<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-salesRequisition__materialbasis}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.materialCoding" placeholder="物料编码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.materialName" placeholder="物料名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('materialBasis:materialbasis:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('materialBasis:materialbasis:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
          </el-table-column>
        <el-table-column prop="materialCoding" label="物料编码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="materialName" label="物料名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="specificationName" label="规格" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="modelName" label="型号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="unitName" label="单位" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="userName" label="创建者" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('materialBasis:materialbasis:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('materialBasis:materialbasis:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('materialBasis:materialbasis:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './materialbasis-add-or-update'
import ViewInfo from './materialbasis-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/materialBasis/materialbasis/page',
        getDataListIsPage: true,
        exportURL: '/materialBasis/materialbasis/export',
        deleteURL: '/materialBasis/materialbasis',
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
