<template>
   <el-dialog :visible.sync="visible" title="模具列表" :close-on-click-modal="false" :append-to-body="true" width="90%" :before-close="handleClose">
     <el-card shadow="never" class="aui-card--fill">
       <div class="block" style="float: left; width:25%; height:600px;">
         <el-scrollbar style="height: 100%;">
           <el-tree :data="mouldTypeTreeList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span @click="handleNodeClick(data, node)">{{ node.label }}</span>
            </span>
           </el-tree>
         </el-scrollbar>
       </div>
      <div class="mod-salesRequisition__mouldbasis}" style="float: left; width:75%;">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.name" placeholder="编码/名称/助记码" clearable></el-input>
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
          <el-table-column prop="code" label="设备编码" header-align="center" align="center"></el-table-column>
          <el-table-column prop="name" label="设备名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="mnemonicCode" label="助记码" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="specifications" label="规格型号" header-align="center" align="center"></el-table-column>
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
        getDataListURL: '/mould/mould/page',
        getDataListIsPage: true,
        exportURL: '/mould/mould/export',
        deleteURL: '/mould/mould',
        deleteIsBatch: true
      },
      requisitionList: [],
      mouldTypeTreeList: [],
      modelList: [],
      unitList: [],
      specificationsList: [],
      dataForm: {
        name: '',
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
        this.getMouldTypeTreeList()
        this.getModelList()
        this.getSpecificationsList()
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
    getMouldTypeTreeList () {
      this.$http.get(`/mould/mouldtype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeTreeList = res.data
        this.dataForm.typeId = ''
        this.dataForm.name = ''
        this.getDataList()
        setTimeout(this.toggleSelection, 1000)
      }).catch(() => {})
    },
    // 型号列表
    getModelList () {
      this.$http.get(`/basis/model/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.modelList = res.data
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
    // 规格列表
    getSpecificationsList () {
      this.$http.get(`/basis/specification/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.specificationsList = res.data
      }).catch(() => {})
    },
    toggleSelection () {
      if (this.requisitionList) {
        for (var i = 0; i < this.requisitionList.length; i++) {
          for (var j = 0; j < this.dataList.length; j++) {
            if (this.requisitionList[i].materialCoding === this.dataList[j].code) {
              this.dataList[j].quantity = this.requisitionList[i].quantity
              this.dataList[j].unitPrice = this.requisitionList[i].unitPrice
              this.dataList[j].amount = this.requisitionList[i].amount
              this.dataList[j].taxRate = this.requisitionList[i].taxRate
              this.dataList[j].taxIncluded = this.requisitionList[i].taxIncluded
              this.dataList[j].taxIncludedAmount = this.requisitionList[i].taxIncludedAmount
              this.$refs.multipleTable.toggleRowSelection(this.dataList[j], true)
              this.$refs.multipleTable.setCurrentRow(this.dataList[j])
            }
          }
        }
      }
    },
    // 弹窗关闭
    handleClose () {
      this.visible = false
    },
    // 选择的信息
    selectHandle (id) {
      console.log(this.dataListSelections)
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
