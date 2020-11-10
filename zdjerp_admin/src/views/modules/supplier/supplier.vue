<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-supplier__supplier}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 180px;">
        <el-input v-model="dataForm.supplierName" placeholder="供应商名称" clearable></el-input>
      </el-form-item>
        <el-form-item style="width: 180px;">
          <el-select v-model="dataForm.supplierTypeId" placeholder="供应商类别" clearable filterable style="width: 100%">
            <el-option
              v-for="item in supplierTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px;">
          <el-input v-model="dataForm.contactMan" placeholder="联系人" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px;">
          <el-input v-model="dataForm.supplierMobile" placeholder="手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('supplier:supplier:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('supplier:supplier:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="supplierName" show-overflow-tooltip label="供应商名称" header-align="center" align="center" width="300"></el-table-column>
        <el-table-column prop="supplierTypeId" show-overflow-tooltip label="供应商类别" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <div v-for="item in  supplierTypeList" :key="item.id" v-if="item.id === scope.row.supplierTypeId">
              {{ item.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierAdd" show-overflow-tooltip label="供应商地址" header-align="center" align="center" width="300"></el-table-column>
        <el-table-column prop="contactMan" show-overflow-tooltip label="联系人" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="supplierMobile" show-overflow-tooltip label="手机" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('supplier:supplier:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('supplier:supplier:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('supplier:supplier:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './supplier-add-or-update'
import ViewInfo from './supplier-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      supplierTypeList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/supplier/supplier/page',
        getDataListIsPage: true,
        exportURL: '/supplier/supplier/export',
        deleteURL: '/supplier/supplier',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        supplierTypeId: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  }, // 实例创建完成后被立即调用
  created () {
    this.getSupplierTypeList() // 获取存放种类数据
  },
  methods: {
    getSupplierTypeList: function () {
      this.$http.get(`/supplier/suppliertype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.supplierTypeList = res.data
      }).catch(() => {
      })
    }
  }

}
</script>
