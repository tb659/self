<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-supplier__suppliercontact}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.id" placeholder="id" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('supplier:suppliercontact:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('supplier:suppliercontact:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="主键id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="supplierId" label="主表id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="联系人姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="phoneNum" label="联系人电话" header-align="center" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" header-align="center" align="center"></el-table-column>
        <el-table-column prop="qq" label="QQ" header-align="center" align="center"></el-table-column>
        <el-table-column prop="weixin" label="微信" header-align="center" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建者" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updater" label="更新者" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="更新时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="delFlag" label="删除标识 0正常 1删除" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('supplier:suppliercontact:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('supplier:suppliercontact:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('supplier:suppliercontact:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './suppliercontact-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/supplier/suppliercontact/page',
        getDataListIsPage: true,
        exportURL: '/supplier/suppliercontact/export',
        deleteURL: '/supplier/suppliercontact',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
