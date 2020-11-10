<template>
   <el-dialog :visible.sync="visible" title="物料库存列表" :close-on-click-modal="false" :append-to-body="true" width="90%" :before-close="handleClose">
     <el-card shadow="never" class="aui-card--fill">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.code" placeholder="物料编码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.name" placeholder="物料名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">{{ $t('query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="selectHandle()">确定</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTable" v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
          <el-table-column type="selection" :selectable="checkBoxChecked" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column header-align="center" align="center" label="序号" width="60">
                <template slot-scope="scope"> {{scope.$index+1}} </template>
            </el-table-column>
          <el-table-column prop="code" label="物料编码" header-align="center" align="center"></el-table-column>
          <el-table-column prop="name" label="物料名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="specificationType" label="规格型号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="unitName" label="单位" header-align="center" align="center"></el-table-column>
          <el-table-column prop="warehouseName" label="库房名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="num" label="库存数量" header-align="center" align="center"></el-table-column>
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
        getDataListURL: '/materiel/materielstock/page',
        getDataListIsPage: true,
        deleteIsBatch: true
      },
      useList: [],
      materielTypeTreeList: [],
      dataForm: {
        id: ''
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
    checkBoxChecked (row, index) {
      if (row.num === '0') {
        return false// 禁用
      } else {
        return true// 不禁用
      }
    },
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getDataList()
        setTimeout(this.toggleSelection, 1000)
      })
    },
    handleNodeClick (data, node) {
      this.dataForm.typeId = data.id
      this.getDataList()
    },
    toggleSelection () {
      if (this.useList) {
        for (var i = 0; i < this.useList.length; i++) {
          for (var j = 0; j < this.dataList.length; j++) {
            if (this.useList[i].materialCoding === this.dataList[j].code) {
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
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('请选择要操作的项！'),
          type: 'warning',
          duration: 500
        })
      }
      this.visible = false
      this.$emit('refreshDataList', this.dataListSelections)
    }
  }
}
</script>
