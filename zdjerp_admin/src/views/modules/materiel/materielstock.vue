<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="block" style="float: left; width: 15%; height: 450px; position:absolute">
      <el-scrollbar style="height: 100%;">
        <el-tree :data="warehouseTreeList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" style="display:inline-block;">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span @click="handleNodeClick(data, node)" :title="node.label">{{ node.label.length > 8 ? node.label.substr(0,8) + '...' : node.label }}</span>
            <span>
              <el-button type="text" v-show="data.pid == 0" size="small" icon="el-icon-refresh" @click="refreshHandle()"></el-button>
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="mod-materiel__materielstock}" style = "float: right; width:83%;">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 180px;">
          <el-input v-model="dataForm.code" placeholder="物料编码" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px;">
          <el-input v-model="dataForm.name" placeholder="物料名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.specificationType" placeholder="规格型号" clearable></el-input>
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
        <el-table-column prop="code" label="物料编码" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="物料名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="specificationType" label="规格型号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="unitName" label="单位" header-align="center" align="center"></el-table-column>
        <el-table-column prop="warehouseName" label="库房" header-align="center" align="center"></el-table-column>
        <el-table-column prop="num" label="数量" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('materiel:materielstock:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
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
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './materielstock-add-or-update'
import ViewInfo from './materielstock-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/materiel/materielstock/page',
        getDataListIsPage: true,
        exportURL: '/materiel/materielstock/export',
        deleteURL: '/materiel/materielstock',
        deleteIsBatch: true
      },
      warehouseTreeList: [],
      dataForm: {
        id: '',
        warehouseId: '',
        code: '',
        name: '',
        specificationType: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        pid: 'pid'
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  created: function () {
    if (this.dataForm.warehouseId === '') {
      this.getWarehouseTreeList()
    }
  },
  methods: {
    refreshHandle () {
      this.getWarehouseTreeList()
    },
    handleNodeClick (data, node) {
      this.dataForm.warehouseId = data.id
      this.getDataList()
    },
    getWarehouseTreeList () {
      this.$http.get(`/basis/storeroom/list`, {
        params: {
          status: 1,
          type: 1
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseTreeList = res.data
        this.dataForm.warehouseId = ''
        this.dataForm.code = ''
        this.dataForm.name = ''
        this.dataForm.specificationType = ''
        this.getDataList()
      }).catch(() => {})
    }
  }
}
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
    white-space: nowrap;
  }
  .el-scrollbar .el-scrollbar__wrap{overflow-x: hidden;}
</style>
