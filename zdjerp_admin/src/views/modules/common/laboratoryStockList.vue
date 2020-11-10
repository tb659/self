<template>
  <el-dialog :visible.sync="visible" title="实验室工具库存列表" :close-on-click-modal="false" :append-to-body="true" width="60%" :close-on-press-escape="false">
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-laboratory__laboratorystock}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="设备名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.mnemonicCode" placeholder="助记码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="selectHandle()">确定</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" v-loading="dataListLoading" stripe :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="code" label="系统编码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="设备名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="power" label="设备功率" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="voltage" label="电压" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="productionCapacity" label="生产能力" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="manufactor" label="生产厂家" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="productionUnit" label="制作单位" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="unitprice" label="单价" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="amount" label="金额" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="taxrate" label="税率" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="taxunitprice" label="含税单价" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="taxamount" label="含税金额" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip header-align="center" align="center"></el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
        style="margin-top:15px;text-align:right;">
      </el-pagination>
    </div>
  </el-card>
  </el-dialog>
</template>
<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      visible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/laboratory/laboratorystock/page',
        getDataListIsPage: true,
        exportURL: '/laboratory/laboratorystock/export',
        deleteURL: '/laboratory/laboratorystock',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      },
      laboratoryStockList: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getDataList()
        setTimeout(this.toggleSelection, 500)
      })
    },
    toggleSelection () {
      if (this.laboratoryStockList) {
        for (var i = 0; i < this.laboratoryStockList.length; i++) {
          for (var j = 0; j < this.dataList.length; j++) {
            if (this.laboratoryStockList[i].id === this.dataList[j].id) {
              this.$refs.multipleTable.toggleRowSelection(this.dataList[j], true)
              this.$refs.multipleTable.setCurrentRow(this.dataList[j])
            }
          }
        }
      }
    },
    // 选择的信息
    selectHandle () {
      if (this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('请选择要操作的项！'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm('确定进行[添加]操作?', this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.visible = false
        this.$emit('refreshDataList', this.dataListSelections)
      }).catch(() => {})
    }
  }
}
</script>
