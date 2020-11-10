<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-mouldreceive__mouldreceiverecord}">
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
          <el-popover v-model="receiveWarehouseTreeListVisible" ref="receiveWarehouseListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="warehouseTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="receiveWarehouseListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="receiveWarehouseListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.warehouseName" v-popover:receiveWarehouseListPopover  placeholder="入库库房">
            <i
              v-if="dataForm.warehouseId !== ''"
              slot="suffix"
              @click.stop="receiveWarehouseListTreeSetDefaultHandle()"
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
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
            <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="workOrderCode" label="工单号" header-align="center" align="center" width="160"></el-table-column>
        <el-table-column prop="moulds" label="领取模具" show-overflow-tooltip header-align="center" align="center" width="160"></el-table-column>
        <el-table-column prop="quantity" label="数量" header-align="center" align="center" width="160"></el-table-column>
        <el-table-column prop="receiveUserName" label="领用人" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="receiveUserPhone" label="领用人电话" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="warehouseName" label="出库库房" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="operatorName" label="经办人" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="receiveTime" label="领用时间" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('mouldreceive:mouldreceiverecord:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
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
import AddOrUpdate from './mouldreceiverecord-add-or-update'
import ViewInfo from './mouldreceiverecord-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/mouldreceive/mouldreceiverecord/page',
        getDataListIsPage: true,
        exportURL: '/mouldreceive/mouldreceiverecord/export',
        deleteURL: '/mouldreceive/mouldreceiverecord',
        deleteIsBatch: true
      },
      receiveUserTreeListVisible: false,
      receiveWarehouseTreeListVisible: false,
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
        warehouseId: '',
        warehouseName: '',
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
    AddOrUpdate, ViewInfo
  },
  created () {
    this.getDeptUserTreeList()
    this.getWarehouseTreeList()
  },
  methods: {
    // 库房
    receiveWarehouseListTreeCurrentChangeHandle (data, node) {
      this.dataForm.warehouseId = data.id
      this.dataForm.warehouseName = data.name
      this.receiveWarehouseTreeListVisible = false
    },
    receiveWarehouseListTreeSetDefaultHandle () {
      this.dataForm.warehouseId = ''
      this.dataForm.warehouseName = ''
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
    // 部门用户树型结构
    getDeptUserTreeList () {
      this.$http.get(`/sys/dept/listDeptAndUser`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.receiveUserTreeList = res.data
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
