<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-salesRequisition__storeroom}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="$hasPermission('basis:storeroom:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList"  row-key="id"  border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column prop="name" label="库房名称" show-overflow-tooltip header-align="center" align="left">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detailHandle(scope.row)">{{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="存储类型" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1">原材料</el-tag>
            <el-tag v-if="scope.row.type === 2">成品</el-tag>
            <el-tag v-if="scope.row.type === 3">一般设备</el-tag>
            <el-tag v-if="scope.row.type === 4">实验室工具</el-tag>
            <el-tag v-if="scope.row.type === 5">模具</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="仓储位置" show-overflow-tooltip header-align="center" align="center"></el-table-column>
<!--        <el-table-column prop="full" label="库房存储状态" header-align="center" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-tag v-if="scope.row.full === 0" size="small" type="danger">已满</el-tag>-->
<!--            <el-tag v-else size="small" type="success">未满</el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="status" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
                       :active-value="1" :inactive-value="0"
                       @change="updateStatusHandle(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('basis:storeroom:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('basis:storeroom:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('basis:storeroom:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './storeroom-add-or-update'
import ViewInfo from './storeroom-view-info'
import { moduleRoutes } from '@/router'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/basis/storeroom/list',
        deleteURL: '/basis/storeroom',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  methods: {
    updateStatusHandle (row) {
      this.$confirm(`确定库房为[${row.name}]状态进行[${row.status ? '启用' : '禁用'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put('/basis/storeroom', {
          'id': row.id,
          'pid': row.pid,
          'status': row.status
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {
        })
      }).catch(() => {
        row.status = Number(!row.status)
      })
    },
    detailHandle (row) {
      if (row.type === 1) {
        // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
        var routeName = `${this.$route.name}__${row.id}`
        var route = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
        if (route) {
          return this.$router.push({ name: routeName, params: { 'pageWarehouseId': row.id } })
        }
        // 否则: 添加并全局变量保存, 再跳转
        route = {
          path: routeName,
          component: () => import(`@/views/modules/basis/materielstock`),
          name: routeName,
          meta: {
            ...window.SITE_CONFIG['contentTabDefault'],
            menuId: this.$route.meta.menuId,
            title: `${this.$route.meta.title} - ` + row.name
          }
        }
        this.$router.addRoutes([
          {
            ...moduleRoutes,
            name: `main-dynamic__${route.name}`,
            children: [route]
          }
        ])
        window.SITE_CONFIG['dynamicRoutes'].push(route)
        this.$router.push({ name: route.name, params: { 'pageWarehouseId': row.id } })
      } else if (row.type === 2) {
        // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
        routeName = `${this.$route.name}__${row.id}`
        route = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
        if (route) {
          return this.$router.push({ name: routeName, params: { 'pageWarehouseId': row.id } })
        }
        // 否则: 添加并全局变量保存, 再跳转
        route = {
          path: routeName,
          component: () => import(`@/views/modules/basis/productstock`),
          name: routeName,
          meta: {
            ...window.SITE_CONFIG['contentTabDefault'],
            menuId: this.$route.meta.menuId,
            title: `${this.$route.meta.title} - ` + row.name
          }
        }
        this.$router.addRoutes([
          {
            ...moduleRoutes,
            name: `main-dynamic__${route.name}`,
            children: [route]
          }
        ])
        window.SITE_CONFIG['dynamicRoutes'].push(route)
        this.$router.push({ name: route.name, params: { 'pageWarehouseId': row.id } })
      }
    }
  }
}
</script>
