<template>
  <el-dialog :visible.sync="visible" title="模具列表" :close-on-click-modal="false" :append-to-body="true" width="65%" :before-close="handleClose">
    <el-card shadow="never" class="aui-card--fill">
      <div class="custom-tree-container">
        <div class="block" style="float: left; overflow-y:auto; overflow-x:auto; width:25%; height:696px;">
          <el-tree :data="mouldTypeTreeList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span @click="handleNodeClick(data, node)">{{ node.label }}</span>
            <span>
              <el-button type="text" v-show="data.pid == 0" size="small" icon="el-icon-refresh" @click="refreshHandle()"></el-button>
            </span>
          </span>
          </el-tree>
        </div>
        <div class="mod-mould__mould}" style="float: left; width:75%;">
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
          <el-table ref="multipleTable" v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
            </el-table-column>
            <el-table-column prop="typeId" label="模具类型" header-align="center" align="center" width="150">
              <template slot-scope="scope">
                <template v-for="type in mouldTypeList">
                  <template v-if="type.id === scope.row.typeId">{{type.name}}</template>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="系统编码" header-align="center" align="center" width="150"></el-table-column>
            <el-table-column prop="name" label="模具名称" header-align="center" align="center" width="150"></el-table-column>
            <el-table-column prop="mnemonicCode" label="助记码" header-align="center" align="center" width="100"></el-table-column>
            <el-table-column prop="unit" label="单位" header-align="center" align="center" width="100">
              <template slot-scope="scope">
                <template v-for="unit in unitList">
                  <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="specifications" label="规格型号" header-align="center" align="center" width="150"></el-table-column>
            <el-table-column prop="applicableComponents" label="模具适用构件" header-align="center" align="center" width="150"></el-table-column>
            <el-table-column prop="entryDate" label="模具进场日期" header-align="center" align="center" width="150"></el-table-column>
            <el-table-column prop="productionUnit" label="制作单位" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
            <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
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
        </div>
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
        getDataListURL: '/mould/mouldstock/page',
        getDataListIsPage: true,
        exportURL: '/mould/mouldstock/export',
        deleteURL: '/mould/mouldstock',
        deleteIsBatch: true
      },
      mouldTypeTreeListVisible: false,
      mouldTypeTreeList: [],
      mouldTypeList: [],
      mouldList: [],
      unitList: [],
      userList: [],
      dataForm: {
        id: '',
        name: '',
        typeId: '',
        typeName: '',
        status: 0
      },
      defaultProps: {
        children: 'children',
        label: function (data, node) {
          if (data.name.length > 8) {
            return data.name.substr(0, 8) + '...'
          } else {
            return data.name
          }
        },
        pid: 'pid'
      }
    }
  },
  created: function () {
    this.getMouldTypeTreeList()
    this.getMouldTypeList()
    this.getUnitList()
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getDataList()
        setTimeout(this.toggleSelection, 1000)
      })
    },
    toggleSelection () {
      if (this.mouldList) {
        for (var i = 0; i < this.mouldList.length; i++) {
          for (var j = 0; j < this.dataList.length; j++) {
            if (this.mouldList[i].id === this.dataList[j].id) {
              this.$refs.multipleTable.toggleRowSelection(this.dataList[j], true)
              this.$refs.multipleTable.setCurrentRow(this.dataList[j])
            }
          }
        }
      }
    },
    // 弹窗关闭
    handleClose (done) {
      done()
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
    refreshHandle () {
      this.getMouldTypeTreeList()
    },
    handleNodeClick (data, node) {
      this.$http.get(`mould/mouldstock/typeId`, {
        params: {
          pids: data.id
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataList = res.data
      }).catch(() => {
      })
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
      }).catch(() => {})
    },
    // 模具类型列表
    getMouldTypeList () {
      this.$http.get(`/mould/mouldtype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeList = res.data
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
</style>
