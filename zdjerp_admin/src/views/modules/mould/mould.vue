<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="custom-tree-container">
      <div class="block" style="float: left; width: 23%; height: 450px; position:absolute">
        <el-scrollbar style="height: 100%;">
          <el-tree :data="mouldTypeTreeList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" style="display:inline-block;">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span @click="handleNodeClick(data, node)" :title="node.label">{{ node.label.length > 8 ? node.label.substr(0,8) + '...' : node.label }}</span>
              <span>
                <el-button type="text" v-show="data.pid == 0" size="small" icon="el-icon-refresh" @click="refreshHandle()"></el-button>
                <el-button type="text" v-if="$hasPermission('mould:mouldtype:save')" size="mini" icon="el-icon-plus" @click="addTypeHandle(data.id)"></el-button>
                <el-button type="text" v-if="$hasPermission('mould:mouldtype:update')" v-show="data.pid != 0" size="mini" icon="el-icon-edit" @click="updateTypeHandle(data.id)"></el-button>
                <el-button type="text" v-if="$hasPermission('mould:mouldtype:delete')" v-show="data.pid != 0" size="mini" icon="el-icon-delete" @click="deleteTypeHandle(data.id)"></el-button>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="mod-mould__mould}" style="float: right; width:75%;">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.name" placeholder="编码/名称/助记码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">{{ $t('query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPermission('mould:mould:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPermission('mould:mould:export')" type="info" @click="exportHandle()">下载模板</el-button>
          </el-form-item>
          <el-form-item>
            <el-upload
              class="upload-demo"
              :action="importUrl"
              accept='.xlsx,.xls'
              :before-upload="beforeUploadHandle"
              :on-success="successHandle">
              <el-button v-if="$hasPermission('mould:mould:import')" type="primary">导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPermission('mould:mould:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
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
          <el-table-column prop="mnemonicCode" label="助记码" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="unit" label="单位" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <template v-for="unit in unitList">
                <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="specifications" label="模具规格" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="applicableComponents" label="模具适用构件" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="entryDate" label="模具进场日期" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="manager" label="负责人" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <template v-for="user in userList">
                <template v-if="user.id === scope.row.manager">{{user.realName}}</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="productionUnit" label="制作单位" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <el-button v-if="$hasPermission('mould:mould:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
              <el-button v-if="$hasPermission('mould:mould:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
              <el-button v-if="$hasPermission('mould:mould:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
        <!-- 类型添加 -->
        <add-or-update-type v-if="addOrUpdateTypeVisible" ref="addOrUpdateType" @refreshDataList="getMouldTypeTreeList"></add-or-update-type>
      </div>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './mould-add-or-update'
import AddOrUpdateType from './mouldtype-add-or-update'
import ViewInfo from './mould-view-info'
import Cookies from 'js-cookie'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      importUrl: `${window.SITE_CONFIG['apiURL']}/mould/mould/import?token=${Cookies.get('token')}`,
      mixinViewModuleOptions: {
        getDataListURL: '/mould/mould/page',
        getDataListIsPage: true,
        exportURL: '/mould/mould/export',
        deleteURL: '/mould/mould',
        deleteIsBatch: true
      },
      addOrUpdateTypeVisible: false,
      mouldTypeTreeListVisible: false,
      mouldTypeTreeList: [],
      mouldTypeList: [],
      unitList: [],
      userList: [],
      dataForm: {
        id: '',
        name: '',
        typeId: '',
        typeName: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        pid: 'pid'
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo, AddOrUpdateType
  },
  created: function () {
    this.getMouldTypeTreeList()
    this.getMouldTypeList()
    this.getUnitList()
    this.getUserList()
  },
  methods: {
    // 上传之前
    beforeUploadHandle (file) {
      if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.error(this.$t('upload.tip', { 'format': 'xlsx、xls' }))
        return false
      }
      this.num++
      this.dataListLoading = true
      this.message = this.$message({
        message: '当前导入Excel数据量过大，时间可能过长，请耐心等候。。。',
        duration: 0
      })
    },
    // 上传成功
    successHandle (res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.message.close()
      this.message = this.$message({
        message: res.data,
        type: 'success',
        duration: 2000,
        onClose: () => {
          this.dataListLoading = false
          this.getDataList()
        }
      })
    },
    refreshHandle () {
      this.getMouldTypeTreeList()
    },
    handleNodeClick (data, node) {
      this.dataForm.typeId = data.id
      this.getDataList()
    },
    addTypeHandle (id) {
      this.addOrUpdateTypeVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateType.dataForm.id = ''
        this.$refs.addOrUpdateType.dataForm.pid = id
        this.$refs.addOrUpdateType.init()
      })
    },
    updateTypeHandle (id) {
      this.addOrUpdateTypeVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateType.dataForm.id = id
        this.$refs.addOrUpdateType.init()
      })
    },
    deleteTypeHandle (id) {
      if (!id) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/mould/mouldtype`, {
          'data': [id]
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.dataForm = {
                id: '',
                name: '',
                typeId: '',
                typeName: ''
              }
              this.getMouldTypeTreeList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
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
    },
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
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
