<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-mouldreceive__mouldreceive}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.workOrderCode" placeholder="工单号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-popover v-model="receiveUserTreeListVisible" ref="receiveUserListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="receiveUserTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="receiveUserListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="receiveUserListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.receiveUserName" v-popover:receiveUserListPopover  placeholder="领用人">
            <i
              v-if="dataForm.receiveUserId !== ''"
              slot="suffix"
              @click.stop="receiveUserListTreeSetDefaultHandle()"
              class="el-icon-circle-close el-input__icon">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.receiveUserPhone" placeholder="领用人电话" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 160px">
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
        <el-form-item style="width: 30%">
          <el-date-picker
            v-model="dateInterval"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions" value-format="yyyy-MM-dd" @change="formatDateInterval">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('mouldreceive:mouldreceive:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('mouldreceive:mouldreceive:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
          </el-table-column>
        <el-table-column prop="workOrderCode" label="工单号" header-align="center" align="center" width="160"></el-table-column>
        <el-table-column prop="receiveTime" label="领用时间" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="receiveUserId" label="领用人" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <template v-for="user in userList">
              <template v-if="user.id === scope.row.receiveUserId">{{user.realName}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="receiveUserPhone" label="领用人电话" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="warehouseId" label="出库库房" header-align="center" align="center" width="150">
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
        <el-table-column prop="status" label="是否领取" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">未领取</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">已领取</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="returnStatus" label="是否退回" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.returnStatus === 0" type="danger" >未退回</el-tag>
            <el-tag v-if="scope.row.returnStatus === 1" type="success">已退回</el-tag>
            <el-tag v-if="scope.row.returnStatus === 2" type="danger">部分退回</el-tag>
          </template>
        </el-table-column>
<!--        <el-table-column prop="reviewStatus" label="审核状态（预留）" header-align="center" align="center"></el-table-column>-->
        <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('mouldreceive:mouldreceive:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('mouldreceive:mouldreceive:update') && scope.row.status === 0" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('mouldreceive:mouldreceive:delete') && scope.row.status === 0" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
            <el-button v-if="$hasPermission('mouldreceive:mouldreceive:receive')  && scope.row.status === 0" type="text" size="small" @click="receiveHandle(scope.row.id)">领取</el-button>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './mouldreceive-add-or-update'
import ViewInfo from './mouldreceive-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/mouldreceive/mouldreceive/page',
        getDataListIsPage: true,
        exportURL: '/mouldreceive/mouldreceive/export',
        deleteURL: '/mouldreceive/mouldreceive',
        deleteIsBatch: true
      },
      receiveUserTreeListVisible: false,
      returnWarehouseTreeListVisible: false,
      receiveUserTreeList: [],
      warehouseTreeList: [],
      userList: [],
      warehouseList: [],
      dateInterval: [],
      dataForm: {
        id: '',
        workOrderCode: '',
        receiveUserId: '',
        receiveUserName: '',
        beginDate: '',
        returnWarehouseId: '',
        returnWarehouseName: '',
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
    AddOrUpdate, ViewInfo
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
    // 用户
    receiveUserListTreeSetDefaultHandle () {
      this.dataForm.receiveUserId = ''
      this.dataForm.receiveUserName = ''
    },
    receiveUserListTreeCurrentChangeHandle (data, node) {
      this.dataForm.receiveUserId = data.id
      this.dataForm.receiveUserName = data.name
      this.receiveUserTreeListVisible = false
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
    // 新增 / 修改
    receiveHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.type = 1
        this.$refs.addOrUpdate.init()
      })
    },
    // 部门用户树型结构
    getDeptUserTreeList () {
      this.$http.get(`/sys/dept/listDeptAndUser`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.receiveUserTreeList = res.data
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
