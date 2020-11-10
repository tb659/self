<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="block tree" style="float: left; width: 23%; height: 450px; position:absolute">
      <el-scrollbar style="height: 100%;">
        <el-tree :data="LaboratoryTypeTreeList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" style="display:inline-block;">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span @click="handleNodeClick(data, node)" :title="node.label">{{ node.label.length > 8 ? node.label.substr(0,8) + '...' : node.label }}</span>
            <span>
              <el-button type="text" v-show="data.pid == 0" size="small" icon="el-icon-refresh" @click="refreshHandle()"></el-button>
              <el-button type="text" size="mini" icon="el-icon-plus" @click="addTypeHandle(data.id)"></el-button>
              <el-button type="text" v-show="data.pid != 0" size="mini" icon="el-icon-edit" @click="updateTypeHandle(data.id)"></el-button>
              <el-button type="text" v-show="data.pid != 0" size="mini" icon="el-icon-delete" @click="deleteTypeHandle(data.id)"></el-button>
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="mod-laboratory__laboratory}" style="float: right; width:75%;">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="实验室工具名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.mnemonicCode" placeholder="助记码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('laboratory:laboratory:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('laboratory:laboratory:export')" type="info" @click="exportHandle()">下载模板</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            :action="importUrl"
            accept='.xlsx,.xls'
            :before-upload="beforeUploadHandle"
            :on-success="successHandle">
            <el-button v-if="$hasPermission('laboratory:laboratory:import')" type="primary">导入</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('laboratory:laboratory:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="code" label="实验室工具编码" show-overflow-tooltip header-align="center" align="center" width="170"></el-table-column>
        <el-table-column prop="name" label="实验室工具名称" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="typeId" label="工具分类" show-overflow-tooltip header-align="center" align="center" width="120">
          <template slot-scope="scope">
            <div v-for="item in  LaboratoryList" :key="item.id" v-if="item.id === scope.row.typeId">
              {{ item.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="manager" label="负责人" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <div v-for="item in  userList" :key="item.id" v-if="item.id === scope.row.manager">
              {{ item.realName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('laboratory:laboratory:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('laboratory:laboratory:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('laboratory:laboratory:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <add-or-update-type v-if="addOrUpdateTypeVisible" ref="addOrUpdateType" @refreshDataList="getLaboratoryTypeTreeList"></add-or-update-type>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './laboratory-add-or-update'
import ViewInfo from './laboratory-view-info'
import AddOrUpdateType from './laboratorytype-add-or-update'
import Cookies from 'js-cookie'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      importUrl: `${window.SITE_CONFIG['apiURL']}/laboratory/laboratory/import?token=${Cookies.get('token')}`,
      userList: [],
      LaboratoryList: [],
      LaboratoryTypeTreeList: [],
      addOrUpdateTypeVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/laboratory/laboratory/page',
        getDataListIsPage: true,
        exportURL: '/laboratory/laboratory/export',
        deleteURL: '/laboratory/laboratory',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        name: '',
        mnemonicCode: ''
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
  }, // 实例创建完成后被立即调用
  created () {
    this.getUserList()
    this.getLaboratoryList()
    this.getLaboratoryTypeTreeList()
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
      this.getLaboratoryTypeTreeList()
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
        this.$http.delete(`/laboratory/laboratorytype`, {
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
              this.getLaboratoryTypeTreeList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 获取实验室列表
    getLaboratoryList () {
      return this.$http.get('/laboratory/laboratorytype/getLaboratoryList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.LaboratoryList = res.data
      }).catch(() => {})
    },
    // 获取实验室列表
    getLaboratoryTypeTreeList () {
      return this.$http.get('/laboratory/laboratorytype/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.LaboratoryTypeTreeList = res.data
        this.dataForm.typeId = ''
        this.dataForm.name = ''
        this.getDataList()
      }).catch(() => {})
    },
    // 用户列表
    getUserList: function () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {
      })
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
