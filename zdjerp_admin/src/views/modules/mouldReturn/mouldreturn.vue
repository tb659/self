<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-mouldReturn__mouldreturn}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.workOrderCode" placeholder="工单号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-popover v-model="returnUserTreeListVisible" ref="returnUserListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="returnUserTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="returnUserListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="returnUserListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.returnUserName" v-popover:returnUserListPopover  placeholder="退回人">
            <i
              v-if="dataForm.returnUserId !== ''"
              slot="suffix"
              @click.stop="returnUserListTreeSetDefaultHandle()"
              class="el-icon-circle-close el-input__icon">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.returnUserPhone" placeholder="退回人电话" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-popover v-model="returnWarehouseTreeListVisible" ref="returnWarehouseListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="warehouseTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="returnWarehouseListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="returnWarehouseListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.returnWarehouseName" v-popover:returnWarehouseListPopover  placeholder="入库库房">
            <i
              v-if="dataForm.returnWarehouseId !== ''"
              slot="suffix"
              @click.stop="returnWarehouseListTreeSetDefaultHandle()"
              class="el-icon-circle-close el-input__icon">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 29%">
          <el-date-picker
            v-model="dateInterval"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="退回开始日期"
            end-placeholder="退回结束日期"
            :picker-options="pickerOptions" value-format="yyyy-MM-dd" @change="formatDateInterval">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('mouldReturn:mouldreturn:save')" type="primary" @click="returnHandle()">退回</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
          </el-table-column>
        <el-table-column prop="workOrderCode" label="工单号" header-align="center" align="center" width="160"></el-table-column>
        <el-table-column prop="returnUserId" label="退回人" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <template v-for="user in userList">
              <template v-if="user.id === scope.row.returnUserId">{{user.realName}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="returnUserPhone" label="退回人电话" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="warehouseId" label="入库库房" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="warehouse in warehouseList">
              <template v-if="warehouse.id === scope.row.warehouseId">{{warehouse.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="operatorId" label="经办人" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <template v-for="user in userList">
              <template v-if="user.id === scope.row.operatorId">{{user.realName}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否退回" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger" size="mini">未退回</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success" size="mini">已退回</el-tag>
            <el-tag v-if="scope.row.status === 2" type="danger" size="mini">部分退回</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="returnTime" label="退回时间" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('mouldReturn:mouldreturn:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('mouldReturn:mouldreturn:update') && scope.row.status !== 1" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">继续退回</el-button>
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
      <!-- 待退回列表页面 -->
      <returned-list v-if="returnedVisible" ref="returned" @refreshDataList="getDataList"></returned-list>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './mouldreturn-add-or-update'
import ViewInfo from './mouldreturn-view-info'
import ReturnedList from './returned-list'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      returnedVisible: false,
      returnUserTreeListVisible: false,
      returnWarehouseTreeListVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/mouldReturn/mouldreturn/page',
        getDataListIsPage: true,
        exportURL: '/mouldReturn/mouldreturn/export',
        deleteURL: '/mouldReturn/mouldreturn',
        deleteIsBatch: true
      },
      returnUserTreeList: [],
      warehouseTreeList: [],
      userList: [],
      warehouseList: [],
      dateInterval: [],
      dataForm: {
        id: '',
        workOrderCode: '',
        returnUserId: '',
        returnUserName: '',
        returnWarehouseId: '',
        returnWarehouseName: '',
        beginDate: '',
        endDate: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  components: {
    ReturnedList, AddOrUpdate, ViewInfo
  },
  created () {
    this.getDeptUserTreeList()
    this.getUserList()
    this.getWarehouseList()
    this.getWarehouseTreeList()
  },
  methods: {
    // 库房
    returnWarehouseListTreeCurrentChangeHandle (data, node) {
      this.dataForm.returnWarehouseId = data.id
      this.dataForm.returnWarehouseName = data.name
      this.returnWarehouseTreeListVisible = false
    },
    returnWarehouseListTreeSetDefaultHandle () {
      this.dataForm.returnWarehouseId = ''
      this.dataForm.returnWarehouseName = ''
    },
    // 部门用户
    returnUserListTreeSetDefaultHandle () {
      this.dataForm.returnUserId = ''
      this.dataForm.returnUserName = ''
    },
    returnUserListTreeCurrentChangeHandle (data, node) {
      this.dataForm.returnUserId = data.id
      this.dataForm.returnUserName = data.name
      this.returnUserTreeListVisible = false
    },
    formatDateInterval (value) {
      if (value != null) {
        this.dataForm.beginDate = this.dateInterval[0]
        this.dataForm.endDate = this.dateInterval[1]
      } else {
        this.dataForm.beginDate = ''
        this.dataForm.endDate = ''
      }
    },
    returnHandle () {
      this.returnedVisible = true
      this.$nextTick(() => {
        this.$refs.returned.init()
      })
    },
    // 部门用户树型结构
    getDeptUserTreeList () {
      this.$http.get(`/sys/dept/listDeptAndUser`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.returnUserTreeList = res.data
      }).catch(() => {})
    },
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {})
    },
    // 仓库树型列表
    getWarehouseList () {
      this.$http.get(`/basis/storeroom/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseList = res.data
      }).catch(() => {})
    },
    // 仓库树形列表
    getWarehouseTreeList () {
      this.$http.get(`/basis/storeroom/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseTreeList = res.data
      }).catch(() => {})
    }
  }
}
</script>
