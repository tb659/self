<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleClose" width="68%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="7">
          <el-form-item label="模具类型" prop="typeId">
            <el-popover v-model="mouldTypeTreeListVisible" ref="mouldTypeTreeListPopover" placement="bottom-start" trigger="click">
              <div style="height: 300px;">
                <el-scrollbar style="height: 100%;">
                  <el-tree
                    :data="mouldTypeTreeList"
                    :props="{ label: 'name', children: 'children' }"
                    node-key="id"
                    ref="mouldTypeTreeListTree"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    accordion
                    @current-change="mouldTypeTreeListTreeCurrentChangeHandle">
                  </el-tree>
                </el-scrollbar>
              </div>
            </el-popover>
            <el-input v-model="dataForm.typeName" v-popover:mouldTypeTreeListPopover :readonly="true" placeholder="模具类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button circle type="primary" v-if="$hasPermission('mould:mouldtype:save')" size="mini" icon="el-icon-plus" @click="addTypeHandle()" style="margin-top: 4px; margin-left: 4px;"></el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统编码" prop="code">
            <el-input v-model="dataForm.code" placeholder="请先选择模具类型" maxlength="50"  :readonly="dataForm.typeId === ''"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模具名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="模具名称"  maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-select v-model="dataForm.unit" filterable clearable placeholder="单位" style="width: 100%;">
              <el-option
                v-for="item in unitList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模具规格" prop="specifications">
            <el-input v-model="dataForm.specifications" placeholder="模具规格"  maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模具适用构件" prop="applicableComponents">
            <el-input v-model="dataForm.applicableComponents" placeholder="模具适用构件"  maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="模具进场日期" prop="entryDate">
            <el-date-picker v-model="dataForm.entryDate" style="width: 100%" value-format="yyyy-MM-dd" placeholder="模具进场日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人" prop="manager">
            <el-popover v-model="managerListVisible" ref="managerListPopover" placement="bottom-start" trigger="click">
              <el-tree
                :data="managerTreeList"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                ref="managerListTree"
                :highlight-current="true"
                :expand-on-click-node="false"
                accordion
                @current-change="managerListTreeCurrentChangeHandle">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.managerName" v-popover:managerListPopover :readonly="true" placeholder="负责人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="制作单位" prop="productionUnit">
        <el-input v-model="dataForm.productionUnit" placeholder="制作单位"  maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"  maxlength="255"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="callOf">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!-- 类型添加 -->
    <add-or-update-type v-if="addOrUpdateTypeVisible" ref="addOrUpdateType" @refreshDataList="getMouldTypeTreeList"></add-or-update-type>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import AddOrUpdateType from './mouldtype-add-or-update'
export default {
  data () {
    return {
      visible: false,
      addOrUpdateTypeVisible: false,
      mouldTypeTreeListVisible: false,
      managerListVisible: false,
      mouldTypeTreeList: [],
      mouldTypeList: [],
      unitList: [],
      managerTreeList: [],
      managerList: [],
      dataForm: {
        id: '',
        typeId: '',
        typeName: '',
        code: '',
        name: '',
        mnemonicCode: '',
        unit: '',
        specifications: '',
        applicableComponents: '',
        entryDate: '',
        manager: '',
        managerName: '',
        productionUnit: '',
        remark: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: ''
      }
    }
  },
  computed: {
    dataRule () {
      let checkCodeUnique = (rule, value, callback) => {
        this.checkCodeUnique(rule, value, callback)
      }
      return {
        typeId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        code: [
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
        this.getMouldTypeTreeList()
        this.getMouldTypeList()
        this.getUnitList()
        this.getDeptUserTreeList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getUserList()
          this.getInfo()
        }
      })
    },
    checkCodeUnique (rule, value, callback) {
      this.$http.get(`/mould/mould/checkCodeUnique`, {
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
        } else {
          callback(new Error('发生异常'))
        }
      })
    },
    addTypeHandle (id) {
      this.addOrUpdateTypeVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateType.init()
      })
    },
    // 所属部门树, 选中
    mouldTypeTreeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.typeId = data.id
      this.dataForm.typeName = data.name
      this.mouldTypeTreeListVisible = false
    },
    managerListTreeCurrentChangeHandle (data, node) {
      this.dataForm.manager = data.id
      this.dataForm.managerName = data.name
      this.managerListVisible = false
    },
    // 产成品类型列表
    getMouldTypeTreeList () {
      this.$http.get(`/mould/mouldtype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeTreeList = res.data
      }).catch(() => {})
    },
    // 产成品类型列表
    getMouldTypeList () {
      this.$http.get(`/mould/mouldtype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeList = res.data
      }).catch(() => {})
    },
    // 单位列表
    getUnitList: function () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.unitList = res.data
      }).catch(() => {
      })
    },
    // 部门用户树型结构
    getDeptUserTreeList () {
      this.$http.get(`/sys/dept/listDeptAndUser`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.managerTreeList = res.data
      }).catch(() => {})
    },
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.managerList = res.data
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/mould/mould/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.mouldTypeList.forEach(item => {
          if (item.id === this.dataForm.typeId) {
            this.dataForm.typeName = item.name
          }
        })
        this.managerList.forEach(item => {
          if (item.id === this.dataForm.manager) {
            this.dataForm.managerName = item.realName
          }
        })
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/mould/mould/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
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
<style>
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
    white-space: nowrap;
  }
  .el-scrollbar .el-scrollbar__wrap{overflow-x: hidden;}
</style>
