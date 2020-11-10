<template>
  <el-dialog :visible.sync="visible" title="待退回列表" :close-on-click-modal="false" :close-on-press-escape="false" width="80%">
    <el-card shadow="never" class="aui-card--fill">
      <div class="mod-mouldreceive__mouldreceive}">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.workOrderCode" placeholder="工单号" clearable></el-input>
          </el-form-item>
          <el-form-item>
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
          <el-form-item>
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
            <el-button :disabled="dataListSelections.length != 1" type="primary" @click="addOrUpdateHandle()">下一步</el-button>
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
              <el-tag v-if="scope.row.returnStatus === 0" type="danger">未退回</el-tag>
              <el-tag v-if="scope.row.returnStatus === 1" type="success">已退回</el-tag>
              <el-tag v-if="scope.row.returnStatus === 2" type="danger">部分退回</el-tag>
            </template>
          </el-table-column>
  <!--        <el-table-column prop="reviewStatus" label="审核状态（预留）" header-align="center" align="center"></el-table-column>-->
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </el-card>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './mouldreturn-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      visible: false,
      addOrUpdateVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/mouldreceive/mouldreceive/page',
        getDataListIsPage: true,
        exportURL: '/mouldreceive/mouldreceive/export',
        deleteURL: '/mouldreceive/mouldreceive',
        deleteIsBatch: true
      },
      receiveUserTreeListVisible: false,
      receiveUserTreeList: [],
      userList: [],
      warehouseList: [],
      dateInterval: [],
      dataForm: {
        id: '',
        returnStatus: 0,
        workOrderCode: '',
        receiveUserId: '',
        receiveUserName: '',
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
    AddOrUpdate
  },
  created () {
    this.getDeptUserTreeList()
    this.getUserList()
    this.getWarehouseList()
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getDataList()
      })
    },
    addOrUpdateHandle () {
      var receive = this.dataListSelections.find((item) => {
        return item
      })
      this.visible = false
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.receiveId = receive.id
        this.$refs.addOrUpdate.init()
      })
    },
    receiveUserListTreeSetDefaultHandle () {
      this.dataForm.receiveUserId = ''
      this.dataForm.receiveUserName = ''
    },
    receiveUserListTreeCurrentChangeHandle (data, node) {
      this.dataForm.receiveUserId = data.id
      this.dataForm.receiveUserName = data.name
      this.receiveUserTreeListVisible = false
    },
    formatDateInterval () {
      this.dataForm.beginDate = this.dateInterval[0]
      this.dataForm.endDate = this.dateInterval[1]
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
    }
  }
}
</script>
