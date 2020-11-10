<template>
   <el-dialog :visible.sync="visible" title="一般设备列表" :close-on-click-modal="false" :append-to-body="true" width="90%" :before-close="handleClose">
     <el-card shadow="never" class="aui-card--fill">
       <div class="block" style="float: left; width:25%; height: 600px;">
         <el-scrollbar style="height: 100%;">
           <el-tree :data="deviceTypeTreeList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span @click="handleNodeClick(data, node)" :title="node.label">{{ node.label }}</span>
            </span>
           </el-tree>
         </el-scrollbar>
       </div>
      <div class="mod-salesRequisition__devicebasis}" style="float: left; width:75%;">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.code" placeholder="设备编码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.deviceName" placeholder="设备名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">{{ $t('query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="selectHandle()">确定</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTable" v-loading="dataListLoading" :row-key="getRowKeys" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50" :reserve-selection="true"></el-table-column>
            <el-table-column header-align="center" align="center" label="序号" width="60">
                <template slot-scope="scope"> {{scope.$index+1}} </template>
            </el-table-column>
          <el-table-column prop="deviceNo" label="设备编码" header-align="center" align="center"></el-table-column>
          <el-table-column prop="name" label="设备名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="specificationType" label="规格型号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" header-align="center" align="center">
            <template slot-scope="scope">
              <template v-for="unit in unitList">
                <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
              </template>
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
        <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
      </div>
     </el-card>
   </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import ViewInfo from '../materialBasis/materialbasis-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      visible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/device/device/page',
        getDataListIsPage: true,
        exportURL: '/device/device/export',
        deleteURL: '/device/device',
        deleteIsBatch: true
      },
      requisitionList: [],
      deviceTypeTreeList: [],
      unitList: [],
      dataForm: {
        id: '',
        code: '',
        deviceName: '',
        codeList: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        pid: 'pid'
      }
    }
  },
  components: {
    ViewInfo
  },
  methods: {
    init () {
      this.visible = true
      this.getCodeList()
      this.$nextTick(() => {
        this.getDeviceTypeTreeList()
        this.getUnitList()
      })
      this.$refs.multipleTable.clearSelection()
    },
    getCodeList () {
      if (this.requisitionList) {
        var list = []
        for (var i = 0; i < this.requisitionList.length; i++) {
          list.push(this.requisitionList[i].materialCoding)
        }
        this.dataForm.codeList = list.toString()
      }
    },
    handleNodeClick (data, node) {
      this.dataForm.typeId = data.id
      this.getDataList()
    },
    getDeviceTypeTreeList () {
      this.$http.get(`/device/devicetype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deviceTypeTreeList = res.data
        this.dataForm.typeId = ''
        this.dataForm.name = ''
        this.getDataList()
      }).catch(() => {})
    },
    // 单位列表
    getUnitList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.unitList = res.data
      }).catch(() => {})
    },
    // 弹窗关闭
    handleClose () {
      this.visible = false
    },
    // 选择的信息
    selectHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('请选择要操作的项！'),
          type: 'warning',
          duration: 500
        })
      }
      this.visible = false
      this.$emit('refreshDataList', this.dataListSelections)
    },
    getRowKeys (row) {
      return row.id
    }
  }
}
</script>
<style>
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
    white-space: nowrap;
  }
  .el-scrollbar .el-scrollbar__wrap{overflow-x: hidden;}
</style>
