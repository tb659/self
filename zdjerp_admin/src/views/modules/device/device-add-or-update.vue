<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="7">
          <el-form-item label="设备类型" prop="deviceTypeName">
            <el-popover v-model="deviceListVisible" ref="laboratoryListPopover" placement="bottom-start" trigger="click">
              <div style="height: 300px;">
                <el-scrollbar style="height: 100%;">
                  <el-tree
                    :data="deviceTypeList"
                    :props="{ label: 'name', children: 'children' }"
                    node-key="id"
                    ref="deptListTree"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    accordion
                    @current-change="deviceListTreeCurrentChangeHandle">
                  </el-tree>
                </el-scrollbar>
              </div>
            </el-popover>
            <el-input v-model="dataForm.deviceTypeName" v-popover:laboratoryListPopover :readonly="true" placeholder="设备类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button circle type="primary" v-if="$hasPermission('device:devicetype:save')" size="mini" icon="el-icon-plus" @click="addTypeHandle()" style="margin-top: 4px; margin-left: 4px;"></el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编码" prop="deviceNo">
            <el-input v-model="dataForm.deviceNo" placeholder="请先选择设备分类" maxlength="50"  :readonly="dataForm.typeId === ''"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="设备名称" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-select v-model="dataForm.unit" filterable clearable placeholder="单位" style="width: 100%">
              <el-option
                v-for="item in articleUnitList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格型号" prop="specificationType">
            <el-input v-model="dataForm.specificationType" placeholder="规格型号" maxlength="225"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产能力" prop="productionCapacity">
            <el-input v-model="dataForm.productionCapacity" placeholder="生产能力" maxlength="225"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备功率" prop="power">
            <el-input v-model="dataForm.power" placeholder="设备功率" maxlength="225"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电压" prop="voltage">
            <el-input v-model="dataForm.voltage" placeholder="电压" maxlength="225"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="生产厂家" prop="manufactor">
            <el-input v-model="dataForm.manufactor" placeholder="生产厂家" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark"  type="textarea" placeholder="备注" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!-- 类型添加 -->
    <add-or-update-type v-if="addOrUpdateTypeVisible" ref="addOrUpdateType" @refreshDataList="getDeviceTypeList"></add-or-update-type>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import AddOrUpdateType from './devicetype-add-or-update'
export default {
  data () {
    return {
      visible: false,
      addOrUpdateTypeVisible: false,
      deviceListVisible: false,
      deptList: [],
      deptListVisible: false,
      useDeptListVisible: false,
      dataForm: {
        id: '',
        typeId: '',
        deviceTypeName: '',
        code: '',
        name: '',
        specificationType: '',
        mnemonicCode: '',
        unit: '',
        deviceNo: '',
        specifications: '',
        model: '',
        power: '',
        voltage: '',
        productionCapacity: '',
        manufactor: '',
        remark: ''
      },
      deviceTypeList: [],
      articleUnitList: [],
      userList: []
    }
  },
  computed: {
    dataRule () {
      let checkCodeUnique = (rule, value, callback) => {
        this.checkCodeUnique(rule, value, callback)
      }
      return {
        deviceTypeName: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        deviceNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: checkCodeUnique, trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    AddOrUpdateType
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getDeviceTypeList(),
          this.getArticleUnitList(),
          this.getUserList(),
          this.getDeptList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    addTypeHandle (id) {
      this.addOrUpdateTypeVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateType.init()
      })
    },
    // 上级树, 选中
    deviceListTreeCurrentChangeHandle (data) {
      this.dataForm.typeId = data.id
      this.dataForm.deviceTypeName = data.name
      this.deviceListVisible = false
    },
    checkCodeUnique (rule, value, callback) {
      console.log(value)
      this.$http.get(`/device/device/checkCodeUnique`, {
        params: {
          'deviceNo': value,
          'typeId': this.dataForm.typeId,
          'id': this.dataForm.id
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          if (data.data.length > 0) {
            callback(new Error('该设备编码已经存在,请重新输入'))
          } else {
            callback()
          }
        } else {
          callback(new Error('发生异常'))
        }
      })
    },
    // 获取物品单位列表
    getArticleUnitList () {
      return this.$http.get('/articleUnit/articleunit/list', {
        params: {
          status: 1
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.articleUnitList = res.data
      }).catch(() => {})
    },
    // 获取设备类型列表
    getDeviceTypeList () {
      this.$http.get('/device/devicetype/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deviceTypeList = res.data
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
    },
    // 获取部门列表
    getDeptList () {
      return this.$http.get('/sys/dept/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/device/device/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 所属部门树, 选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.subordinateDept = data.id
      this.dataForm.subordinateDeptName = data.name
      this.deptListVisible = false
    },
    // 使用部门树, 选中
    useDeptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.useDept = data.id
      this.dataForm.useDeptName = data.name
      this.useDeptListVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/device/device/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style>
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
    white-space: nowrap;
  }
  .el-scrollbar .el-scrollbar__wrap{overflow-x: hidden;}
</style>
