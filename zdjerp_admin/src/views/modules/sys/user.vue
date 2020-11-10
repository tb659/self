<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="custom-tree-container">
      <div class="block" style="float: left; width:23%;">
        <el-tree :data="deptTreeList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span @click="handleNodeClick(data, node)">{{ node.label }}</span>
            <span>
              <el-button type="text" v-show="data.pid == 0" size="small" icon="el-icon-refresh" @click="refreshHandle()"></el-button>
              <el-button type="text" v-if="$hasPermission('sys:dept:save')" size="mini" icon="el-icon-plus" @click="addDeptHandle(data.id)"></el-button>
              <el-button type="text" v-if="$hasPermission('sys:dept:update')" v-show="data.pid != 0" size="mini" icon="el-icon-edit" @click="updateDeptHandle(data.id)"></el-button>
              <el-button type="text" v-if="$hasPermission('sys:dept:delete')" v-show="data.pid != 0" size="mini" icon="el-icon-delete" @click="deleteDeptHandle(data.id)"></el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="mod-sys__user" style="float: left; width:75%;">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.name" placeholder="用户名/姓名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.mobile" placeholder="手机号" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">{{ $t('query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPermission('sys:user:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPermission('sys:user:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPermission('sys:user:export')" type="info" @click="exportHandle()">导出模板</el-button>
          </el-form-item>
          <el-form-item>
            <el-upload
              class="upload-demo"
              :action="importUrl"
              accept='.xlsx,.xls'
              :before-upload="beforeUploadHandle"
              :on-success="successHandle">
              <el-button v-if="$hasPermission('sys:user:import')" type="primary">导入</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          @selection-change="dataListSelectionChangeHandle"
          @sort-change="dataListSortChangeHandle"
          style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="username" :label="$t('user.username')" sortable="custom" header-align="center" align="center" width="110"></el-table-column>
          <el-table-column prop="realName" label="姓名" sortable="custom" header-align="center" align="center" width="110"></el-table-column>
          <el-table-column prop="deptName" :label="$t('user.deptName')" header-align="center" align="center" width="130"></el-table-column>
          <el-table-column prop="email" :label="$t('user.email')" header-align="center" align="center"></el-table-column>
          <el-table-column prop="mobile" :label="$t('user.mobile')" sortable="custom" header-align="center" align="center" width="110"></el-table-column>
          <el-table-column prop="status" :label="$t('user.status')" sortable="custom" header-align="center" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t('user.status0') }}</el-tag>
              <el-tag v-else size="small" type="success">{{ $t('user.status1') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createDate" :label="$t('user.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <el-button v-if="$hasPermission('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
              <el-button v-if="$hasPermission('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
        <!-- 部门弹窗，新增/修改 -->
        <add-or-update-dept v-if="addOrUpdateDeptVisible" ref="addOrUpdateDept" @refreshDataList="getDeptTreeList"></add-or-update-dept>
      </div>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './user-add-or-update'
import AddOrUpdateDept from './dept-add-or-update'
import Cookies from 'js-cookie'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      addOrUpdateDeptVisible: false,
      deptTreeList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/sys/user/page',
        getDataListIsPage: true,
        deleteURL: '/sys/user',
        deleteIsBatch: true,
        exportURL: '/sys/user/export'
      },
      dataForm: {
        name: '',
        deptId: '',
        mobile: ''
      },
      importUrl: `${window.SITE_CONFIG['apiURL']}/sys/user/import?token=${Cookies.get('token')}`,
      message: '',
      defaultProps: {
        children: 'children',
        label: 'name',
        pid: 'pid'
      }
    }
  },
  components: {
    AddOrUpdate, AddOrUpdateDept
  },
  created: function () {
    this.getDeptTreeList()
  },
  methods: {
    refreshHandle () {
      this.getDeptTreeList()
    },
    handleNodeClick (data, node) {
      console.log(data.pid !== '0')
      if (data.pid !== '0') {
        this.dataForm.deptId = data.id
      }
      this.getDataList()
    },
    addDeptHandle (id) {
      this.addOrUpdateDeptVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateDept.dataForm.pid = id
        this.$refs.addOrUpdateDept.init()
      })
    },
    updateDeptHandle (id) {
      this.addOrUpdateDeptVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateDept.dataForm.id = id
        this.$refs.addOrUpdateDept.init()
      })
    },
    deleteDeptHandle (id) {
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
        this.$http.delete(`/sys/dept/${id}`).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDeptTreeList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    getDeptTreeList () {
      this.$http.get(`/sys/dept/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptTreeList = res.data
        this.dataForm.deptId = ''
        this.dataForm.name = ''
        this.getDataList()
      }).catch(() => {})
    },
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
