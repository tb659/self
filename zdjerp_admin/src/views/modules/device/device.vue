<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="block" style="float: left; width: 23%; height: 450px; position:absolute">
      <el-scrollbar style="height: 100%;">
        <el-tree :data="deviceTypeTreeList" :props="defaultProps" :highlight-current="true" node-key="id" :expand-on-click-node="false" style="display:inline-block;">
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
    <div class="mod-device__device}" style="float: right; width:75%;">
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
          <el-button v-if="$hasPermission('device:device:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('device:device:export')" type="info" @click="exportHandle()">导出模板</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            :action="importUrl"
            accept='.xlsx,.xls'
            :before-upload="beforeUploadHandle"
            :on-success="successHandle">
            <el-button v-if="$hasPermission('device:device:import')" type="primary">导入</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('device:device:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="deviceNo" label="设备编号" show-overflow-tooltip header-align="center" align="center" width="170"></el-table-column>
        <el-table-column prop="name" label="设备名称" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="typeId" label="设备类型" show-overflow-tooltip header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <div v-for="item in  deviceTypeList" :key="item.id" v-if="item.id === scope.row.typeId">
              {{ item.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="manager" label="负责人" show-overflow-tooltip header-align="center" align="center" width="120">
          <template slot-scope="scope">
            <div v-for="item in  userList" :key="item.id" v-if="item.id === scope.row.manager">
              {{ item.realName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('checkingMenu:checkingmenu:page')" type="text" size="small" @click="setCheckingHandle(scope.row)">设置巡检</el-button>
            <el-button v-if="$hasPermission('maintainMenu:maintainmenu:page')" type="text" size="small" @click="setMaintainHandle(scope.row)">设置保养</el-button>
            <el-button v-if="$hasPermission('device:device:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('device:device:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('device:device:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshHandle"></add-or-update>
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
      <!-- 类型添加 -->
      <add-or-update-type v-if="addOrUpdateTypeVisible" ref="addOrUpdateType" @refreshDataList="getDeviceTypeTreeList"></add-or-update-type>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './device-add-or-update'
import ViewInfo from './device-view-info'
import AddOrUpdateType from './devicetype-add-or-update'
import { moduleRoutes } from '@/router'
import Cookies from 'js-cookie'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      importUrl: `${window.SITE_CONFIG['apiURL']}/device/device/import?token=${Cookies.get('token')}`,
      userList: [],
      deviceTypeList: [],
      deviceTypeTreeList: [],
      addOrUpdateTypeVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/device/device/page',
        getDataListIsPage: true,
        exportURL: '/device/device/export',
        deleteURL: '/device/device',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        typeId: '',
        code: '',
        name: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        pid: 'pid'
      },
      message: ''
    }
  },
  components: {
    AddOrUpdate, ViewInfo, AddOrUpdateType
  }, // 实例创建完成后被立即调用
  created () {
    this.getUserList()
    this.getDeviceList()
    this.getDeviceTypeTreeList()
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
      this.getDeviceTypeTreeList()
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
        this.$http.delete(`/device/devicetype`, {
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
              this.getDeviceTypeTreeList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 设置巡检
    setCheckingHandle (row) {
      // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
      let routeName = `${this.$route.name}__checking__${row.id}`
      // 否则: 添加并全局变量保存, 再跳转
      let route = {
        path: routeName,
        component: () => import(`@/views/modules/checkingMenu/checkingmenu`),
        name: routeName,
        meta: {
          ...window.SITE_CONFIG['contentTabDefault'],
          menuId: this.$route.meta.menuId,
          title: `${row.name}-设置巡检配置`
        }
      }
      this.$router.addRoutes([
        {
          ...moduleRoutes,
          name: `main-dynamic__${routeName}`,
          children: [route]
        }
      ])
      window.SITE_CONFIG['dynamicRoutes'].push(route)
      this.$router.push({ name: routeName, params: { 'deviceId': row.id } })
    }, // 设置保养
    setMaintainHandle (row) {
      // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
      let routeName = `${this.$route.name}__Maintain__${row.id}`
      // 否则: 添加并全局变量保存, 再跳转
      let route = {
        path: routeName,
        component: () => import(`@/views/modules/maintainMenu/maintainmenu`),
        name: routeName,
        meta: {
          ...window.SITE_CONFIG['contentTabDefault'],
          menuId: this.$route.meta.menuId,
          title: `${row.name}-设置保养配置`
        }
      }
      this.$router.addRoutes([
        {
          ...moduleRoutes,
          name: `main-dynamic__${routeName}`,
          children: [route]
        }
      ])
      window.SITE_CONFIG['dynamicRoutes'].push(route)
      this.$router.push({ name: routeName, params: { 'deviceId': row.id } })
    },
    // 获取实验室列表
    getDeviceList () {
      return this.$http.get('/device/devicetype/getDeviceList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deviceTypeList = res.data
      }).catch(() => {})
    },
    getDeviceTypeTreeList () {
      this.$http.get(`/device/devicetype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deviceTypeTreeList = res.data
        this.dataForm.typeId = ''
        this.dataForm.code = ''
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
