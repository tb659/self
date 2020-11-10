<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close="true" :before-close="handleClose" width="65%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '100px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="工单号" prop="workOrderCode">
            <el-input v-model="dataForm.workOrderCode" :readonly="true" placeholder="工单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出库库房" prop="warehouseId">
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
            <el-input v-model="dataForm.warehouseName" v-popover:warehouseListPopover :readonly="true" placeholder="出库库房"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="领用时间" prop="receiveTime">
            <el-date-picker v-model="dataForm.receiveTime" style="width: 100%" value-format="yyyy-MM-dd" placeholder="领用时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="领用人" prop="receiveUserId">
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
            <el-input v-model="dataForm.receiveUserName" v-popover:receiveUserListPopover :readonly="true" placeholder="领用人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="领用人电话" prop="receiveUserPhone">
            <el-input v-model="dataForm.receiveUserPhone" placeholder="领用人电话"></el-input>
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
        <el-table-column v-if="type === 0" :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot="header" slot-scope="scope">
            <el-button type="primary" @click="addMouldHandle()">选择模具</el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="mouldViewInfoHandle(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template slot="footer">
      <el-button @click="callOf">{{ $t('cancel') }}</el-button>
      <el-button type="primary" v-if="type === 0" @click="dataFormSubmitHandle()">保存</el-button>
      <el-button type="primary" v-if="type === 0" @click="submitAndReceiveHandle()">保存并领取</el-button>
      <el-button type="primary" v-if="type === 1" @click="receiveHandle()">领取</el-button>
    </template>
    <!-- 弹窗, 新增 / 修改 -->
    <add-mould v-if="addMouldVisible" ref="addMould" @refreshDataList="getDataList"></add-mould>
    <mould-view v-if="mouldViewVisible" ref="mouldView" @refreshDataList="getDataList"></mould-view>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import debounce from 'lodash/debounce'
import AddMould from './../common/mouldstocklist'
import MouldView from './../mould/mouldstock-view-info'
import { isMobile } from '@/utils/validate'
export default {
  mixins: [mixinViewModule],
  props: ['dataList'],
  data () {
    return {
      visible: false,
      type: 0,
      mouldViewVisible: false,
      addMouldVisible: false,
      warehouseTreeListVisible: false,
      warehouseTreeList: [],
      warehouseList: [],
      receiveUserTreeListVisible: false,
      receiveUserTreeList: [],
      operatorTreeListVisible: false,
      operatorTreeList: [],
      userList: [],
      mouldTypeList: [],
      unitList: [],
      specificationsList: [],
      dataForm: {
        id: '',
        workOrderCode: '',
        receiveTime: '',
        receiveUserId: '',
        receiveUserName: '',
        receiveUserPhone: '',
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
        mouldList: [],
        mouldIds: []
      }
    }
  },
  components: {
    AddMould, MouldView
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
        workOrderCode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        receiveTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        receiveUserId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        receiveUserPhone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        operatorId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
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
      this.dataList = []
      this.$nextTick(() => {
        this.getWarehouseTreeList()
        this.getDeptUserTreeList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getWarehouseList()
          this.getUserList()
          this.getInfo()
        } else {
          this.getWorkOrderCode()
        }
      })
    },
    getDataList (res) {
      this.dataList = res
    },
    // 添加
    addMouldHandle: function () {
      this.addMouldVisible = true
      this.$nextTick(() => {
        this.$refs.addMould.mouldList = this.dataList
        this.$refs.addMould.init()
      })
    },
    mouldViewInfoHandle: function (id) {
      this.mouldViewVisible = true
      this.$nextTick(() => {
        this.$refs.mouldView.dataForm.id = id
        this.$refs.mouldView.init()
      })
    },
    deleteRow: function (index) {
      this.dataList.splice(index, 1)
    },
    getWorkOrderCode () {
      this.$http.get(`/numberRule/numberrule/searchkey/MJLQ`).then(({ data: res }) => {
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
    receiveUserListTreeCurrentChangeHandle (data, node) {
      this.dataForm.receiveUserId = data.id
      this.dataForm.receiveUserName = data.name
      this.receiveUserTreeListVisible = false
    },
    operatorListTreeCurrentChangeHandle (data, node) {
      this.dataForm.operatorId = data.id
      this.dataForm.operatorName = data.name
      this.operatorTreeListVisible = false
    },
    // 部门用户树型结构
    getDeptUserTreeList () {
      this.$http.get(`/sys/dept/listDeptAndUser`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.receiveUserTreeList = res.data
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
      this.$http.get(`/mouldreceive/mouldreceive/${this.dataForm.id}`).then(({ data: res }) => {
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
          if (item.id === this.dataForm.receiveUserId) {
            this.dataForm.receiveUserName = item.realName
          }
          if (item.id === this.dataForm.operatorId) {
            this.dataForm.operatorName = item.realName
          }
        })
        this.dataList = res.data.mouldList
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.dataList === null || this.dataList.length === 0) {
          this.$message({
            message: '请选择要领取的模具',
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
        for (var i = 0; i < this.dataList.length; i++) {
          if (i === this.dataList.length - 1) {
            this.dataForm.mouldIds += this.dataList[i].id
          } else {
            this.dataForm.mouldIds += this.dataList[i].id + ','
          }
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/mouldreceive/mouldreceive/', this.dataForm).then(({ data: res }) => {
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
    // 保存并领取
    submitAndReceiveHandle: debounce(function () {
      this.$confirm('确定进行[领取]操作?', this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          if (this.dataList === null || this.dataList.length === 0) {
            this.$message({
              message: '请选择要领取的模具',
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
          for (var i = 0; i < this.dataList.length; i++) {
            if (i === this.dataList.length - 1) {
              this.dataForm.mouldIds += this.dataList[i].id
            } else {
              this.dataForm.mouldIds += this.dataList[i].id + ','
            }
          }
          this.$http.post('/mouldreceive/mouldreceive/saveAndReceive', this.dataForm).then(({ data: res }) => {
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
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    receiveHandle: debounce(function () {
      this.$confirm('确定进行[领取]操作?', this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          if (this.dataList === null || this.dataList.length === 0) {
            this.$message({
              message: '请选择要领取的模具',
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
          for (var i = 0; i < this.dataList.length; i++) {
            if (i === this.dataList.length - 1) {
              this.dataForm.mouldIds += this.dataList[i].id
            } else {
              this.dataForm.mouldIds += this.dataList[i].id + ','
            }
          }
          this.$http.post('/mouldreceive/mouldreceive/receive', this.dataForm).then(({ data: res }) => {
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
          }).catch(() => {
          })
        })
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
