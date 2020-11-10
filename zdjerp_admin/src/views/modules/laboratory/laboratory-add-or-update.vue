<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="7">
          <el-form-item label="工具分类" prop="parentName">
            <el-popover v-model="laboratoryListVisible" ref="laboratoryListPopover" placement="bottom-start" trigger="click">
              <div style="height: 300px;">
                <el-scrollbar style="height: 100%;">
                  <el-tree
                    :data="typeList"
                    :props="{ label: 'name', children: 'children' }"
                    node-key="id"
                    ref="deptListTree"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    accordion
                    @current-change="laboratoryListTreeCurrentChangeHandle">
                  </el-tree>
                </el-scrollbar>
              </div>
            </el-popover>
            <el-input v-model="dataForm.parentName" v-popover:laboratoryListPopover :readonly="true" placeholder="实验室工具分类"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button circle type="primary" v-if="$hasPermission('laboratory:laboratorytype:save')" size="mini" icon="el-icon-plus" @click="addTypeHandle()" style="margin-top: 4px; margin-left: 4px;"></el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统编码" prop="code">
            <el-input v-model="dataForm.code" placeholder="系统编码" maxlength="50" :disabled="!dataForm.id?false:true"></el-input>
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
          <el-form-item label="数量" prop="quantity">
            <el-input-number controls-position="right" v-model="dataForm.quantity" :min="1" placeholder="数量" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格型号" prop="specificationType">
            <el-input v-model="dataForm.specificationType" placeholder="规格型号" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备功率" prop="power">
            <el-input v-model="dataForm.power" placeholder="设备功率" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电压" prop="voltage">
            <el-input v-model="dataForm.voltage" placeholder="电压" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产能力" prop="productionCapacity">
            <el-input v-model="dataForm.productionCapacity" placeholder="生产能力" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="生产厂家" prop="manufactor">
            <el-input v-model="dataForm.manufactor" placeholder="生产厂家" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制作单位" prop="productionUnit">
            <el-input v-model="dataForm.productionUnit" placeholder="制作单位" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用部门" prop="useDeptName">
            <el-popover v-model="useDeptListVisible" ref="useDeptListPopover" placement="bottom-start" trigger="click">
              <el-tree
                :data="deptList"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                ref="useDeptListTree"
                :highlight-current="true"
                :expand-on-click-node="false"
                accordion
                @current-change="useDeptListTreeCurrentChangeHandle">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.useDeptName" v-popover:useDeptListPopover :readonly="true" placeholder="使用部门"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="负责人" prop="manager">
            <el-select v-model="dataForm.manager" filterable clearable placeholder="负责人" style="width: 100%">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
          <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark"  type="textarea" placeholder="备注" maxlength="200"></el-input>
      </el-form-item>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!-- 类型添加 -->
    <add-or-update-type v-if="addOrUpdateTypeVisible" ref="addOrUpdateType" @refreshDataList="getLaboratoryList"></add-or-update-type>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import AddOrUpdateType from './laboratorytype-add-or-update'
export default {
  data () {
    return {
      visible: false,
      addOrUpdateTypeVisible: false,
      laboratoryListVisible: false,
      deptList: [],
      useDeptListVisible: false,
      dataForm: {
        id: '',
        typeId: '',
        code: '',
        name: '',
        mnemonicCode: '',
        unit: '',
        quantity: '',
        specifications: '',
        model: '',
        power: '',
        voltage: '',
        specificationType: '',
        productionCapacity: '',
        manufactor: '',
        subordinateDept: '0',
        useDept: '0',
        useDeptName: '',
        manager: '',
        productionUnit: '',
        remark: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        parentName: ''
      },
      typeList: [],
      articleUnitList: [],
      userList: []
    }
  },
  computed: {
    dataRule () {
      let checkCodeUnique = (rule, value, callback) => {
        if (!this.dataForm.id) {
          this.checkCodeUnique(rule, value, callback)
        } else {
          callback()
        }
      }
      return {
        typeId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: checkCodeUnique, trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
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
          this.getLaboratoryList(),
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
    addTypeHandle () {
      this.addOrUpdateTypeVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateType.init()
      })
    },
    checkCodeUnique (rule, value, callback) {
      this.$http.get(`/laboratory/laboratory/checkCodeUnique`, {
        params: {
          'code': value,
          'typeId': this.dataForm.typeId,
          'id': this.dataForm.id
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          if (data.data.length > 0) {
            callback(new Error('该系统编码已经存在,请重新输入'))
          } else {
            callback()
          }
        }
      })
    },
    // 上级树, 选中
    laboratoryListTreeCurrentChangeHandle (data) {
      this.dataForm.typeId = data.id
      this.dataForm.parentName = data.name
      this.laboratoryListVisible = false
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
    // 获取实验室列表
    getLaboratoryList () {
      return this.$http.get('/laboratory/laboratorytype/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.typeList = res.data
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
      this.$http.get(`/laboratory/laboratory/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/laboratory/laboratory/', this.dataForm).then(({ data: res }) => {
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
