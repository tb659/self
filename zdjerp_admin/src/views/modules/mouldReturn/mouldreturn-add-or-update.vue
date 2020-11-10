<template>
  <el-dialog :visible.sync="visible" title="退回" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleClose" append-to-body width="65%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '100px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="工单号" prop="workOrderCode">
            <el-input v-model="dataForm.workOrderCode" :readonly="true" placeholder="工单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库库房" prop="warehouseId">
            <el-popover v-model="warehouseTreeListVisible" ref="warehouseListPopover" placement="bottom-start" trigger="click">
              <el-tree
                :data="warehouseTreeList"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                ref="warehouseListTree"
                :highlight-current="true"
                :expand-on-click-node="false"
                accordion
                @current-change="warehouseListTreeCurrentChangeHandle">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.warehouseName" v-popover:warehouseListPopover :readonly="true" placeholder="入库库房"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="退回时间" prop="returnTime">
            <el-date-picker v-model="dataForm.returnTime" style="width: 100%" value-format="yyyy-MM-dd" placeholder="退回时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="退回人" prop="returnUserId">
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
            <el-input v-model="dataForm.returnUserName" v-popover:returnUserListPopover :readonly="true" placeholder="退回人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="退回人电话" prop="returnUserPhone">
            <el-input v-model="dataForm.returnUserPhone" placeholder="退回人电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经办人" prop="operatorId">
            <el-popover v-model="operatorTreeListVisible" ref="operatorListPopover" placement="bottom-start" trigger="click">
              <el-tree
                :data="operatorTreeList"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                ref="operatorListTree"
                :highlight-current="true"
                :expand-on-click-node="false"
                accordion
                @current-change="operatorListTreeCurrentChangeHandle">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.operatorName" v-popover:operatorListPopover :readonly="true" placeholder="经办人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="typeId" show-overflow-tooltip label="模具类型" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="type in mouldTypeList">
              <template v-if="type.id === scope.row.typeId">{{type.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="code" show-overflow-tooltip label="系统编码" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="模具名称" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="mnemonicCode" show-overflow-tooltip label="助记码" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="unit" show-overflow-tooltip label="单位" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="unit in unitList">
              <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="specifications" show-overflow-tooltip label="模具规格" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="applicableComponents" show-overflow-tooltip label="模具适用构件" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="entryDate" show-overflow-tooltip label="模具进场日期" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="productionUnit" show-overflow-tooltip label="制作单位" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center" width="150"></el-table-column>
      </el-table>
    </el-form>
    <template slot="footer">
      <el-button @click="callOf">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import debounce from 'lodash/debounce'
import { isMobile } from '@/utils/validate'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      visible: false,
      warehouseTreeListVisible: false,
      warehouseTreeList: [],
      warehouseList: [],
      returnUserTreeListVisible: false,
      returnUserTreeList: [],
      operatorTreeListVisible: false,
      operatorTreeList: [],
      userList: [],
      mouldTypeList: [],
      unitList: [],
      specificationsList: [],
      dataForm: {
        id: '',
        receiveId: '',
        workOrderCode: '',
        returnTime: '',
        returnUserId: '',
        returnUserName: '',
        returnUserPhone: '',
        warehouseId: '',
        warehouseName: '',
        operatorId: '',
        operatorName: '',
        remark: '',
        status: '',
        reviewStatus: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        mouldIds: [],
        mouldList: []
      }
    }
  },
  computed: {
    dataRule () {
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.mobile') })))
        }
        callback()
      }
      return {
        receiveId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        workOrderCode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        returnTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        returnUserId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        returnUserPhone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        operatorId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        status: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        reviewStatus: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updater: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updateDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.getMouldTypeList()
    this.getUnitList()
    this.getSpecificationsList()
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getWarehouseTreeList()
        this.getDeptUserTreeList()
        if (this.dataForm.id) {
          this.getWarehouseList()
          this.getUserList()
          this.getInfo()
        } else {
          this.getWorkOrderCode()
          this.getMouldList()
        }
      })
    },
    getWorkOrderCode () {
      this.$http.get(`/numberRule/numberrule/searchkey/MJTH`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm.workOrderCode = res.data
      }).catch(() => {})
    },
    warehouseListTreeCurrentChangeHandle (data, node) {
      this.dataForm.warehouseId = data.id
      this.dataForm.warehouseName = data.name
      this.warehouseTreeListVisible = false
    },
    // 仓库树型列表
    getWarehouseTreeList () {
      this.$http.get(`/basis/storeroom/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseTreeList = res.data
      }).catch(() => {})
    },
    // 仓库列表
    getWarehouseList () {
      this.$http.get(`/basis/storeroom/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseList = res.data
      }).catch(() => {})
    },
    getDeptUserTreeList () {
      this.$http.get(`/sys/dept/listDeptAndUser`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.returnUserTreeList = res.data
        this.operatorTreeList = res.data
      }).catch(() => {})
    },
    // 用户列表
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {})
    },
    returnUserListTreeCurrentChangeHandle (data, node) {
      this.dataForm.returnUserId = data.id
      this.dataForm.returnUserName = data.name
      this.returnUserTreeListVisible = false
    },
    operatorListTreeCurrentChangeHandle (data, node) {
      this.dataForm.operatorId = data.id
      this.dataForm.operatorName = data.name
      this.operatorTreeListVisible = false
    },
    getMouldList () {
      this.$http.get(`mouldreceive/mouldreceivedetail/getReceiveMouldList`, {
        params: {
          receiveId: this.dataForm.receiveId
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        // this.dataForm.mouldList = {
        //   ...this.dataForm.mouldList,
        //   ...res.data
        // }
        this.dataList = res.data
      })
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
    // 规格列表
    getSpecificationsList () {
      this.$http.get(`/basis/specification/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.specificationsList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/mouldReturn/mouldreturn/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.warehouseList.forEach(item => {
          if (item.id === this.dataForm.warehouseId) {
            this.dataForm.warehouseName = item.name
          }
        })
        this.userList.forEach(item => {
          if (item.id === this.dataForm.returnUserId) {
            this.dataForm.returnUserName = item.realName
          }
          if (item.id === this.dataForm.operatorId) {
            this.dataForm.operatorName = item.realName
          }
        })
        this.dataList = this.dataForm.mouldList
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.dataListSelections.length <= 0) {
          this.$message({
            message: '请选择要退回的模具',
            type: 'error',
            duration: 1500
          })
          return false
        }
        const loading = this.$loading({
          lock: true,
          text: '操作中。。。',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.dataForm.mouldIds = ''
        for (var i = 0; i < this.dataListSelections.length; i++) {
          if (i === this.dataListSelections.length - 1) {
            this.dataForm.mouldIds += this.dataListSelections[i].id
          } else {
            this.dataForm.mouldIds += this.dataListSelections[i].id + ','
          }
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/mouldReturn/mouldreturn/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              loading.close()
              this.callOf()
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    // 取消
    callOf () {
      this.visible = false
      this.$store.state.contentIsNeedRefresh = true
      this.$nextTick(() => {
        this.$store.state.contentIsNeedRefresh = false
      })
    },
    // 弹窗关闭
    handleClose (done) {
      done()
      this.$store.state.contentIsNeedRefresh = true
      this.$nextTick(() => {
        this.$store.state.contentIsNeedRefresh = false
      })
    }
  }
}
</script>
