<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleClose" width="65%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="7">
          <el-form-item label="物料类型" prop="typeId">
            <el-popover v-model="materielTypeTreeListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
              <div style="height: 300px;">
                <el-scrollbar style="height: 100%;">
                  <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                  <el-tree
                    class="filter-tree"
                    :data="materielTypeTreeList"
                    :props="{ label: 'name', children: 'children' }"
                    node-key="id"
                    ref="deptListTree"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    accordion
                    @current-change="materielTypeTreeListTreeCurrentChangeHandle"
                    :filter-node-method="filterNode">
                  </el-tree>
                </el-scrollbar>
              </div>
            </el-popover>
            <el-input v-model="dataForm.typeName" v-popover:deptListPopover :readonly="true" placeholder="物料类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button circle type="primary" v-if="$hasPermission('materiel:materieltype:save')" size="mini" icon="el-icon-plus" @click="addTypeHandle()" style="margin-top: 4px; margin-left: 4px;"></el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料编码" prop="code">
            <el-input v-model="dataForm.code" placeholder="请先选择物料类型再输入" :maxlength="50" :readonly="dataForm.typeId === ''"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="物料名称" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="别名" prop="alias">
            <el-input v-model="dataForm.alias" placeholder="别名" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
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
          <el-form-item label="规格型号" prop="outlineSize">
            <el-input v-model="dataForm.outlineSize" placeholder="规格型号" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="备注" :maxlength="255"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="callOf">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!-- 类型添加 -->
    <add-or-update-type v-if="addOrUpdateTypeVisible" ref="addOrUpdateType" @refreshDataList="getMaterielTypeTreeList"></add-or-update-type>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import AddOrUpdateType from './materieltype-add-or-update'
export default {
  data () {
    return {
      visible: false,
      addOrUpdateTypeVisible: false,
      materielTypeTreeListVisible: false,
      materielTypeTreeList: [],
      materielTypeList: [],
      unitList: [],
      modelList: [],
      specificationList: [],
      filterText: '',
      dataForm: {
        id: '',
        typeId: '',
        typeName: '',
        code: '',
        name: '',
        mnemonicCode: '',
        alias: '',
        unit: '',
        outlineSize: '',
        specifications: '',
        model: '',
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
      var validateCode = (rule, value, callback) => {
        this.inquireCode(value, callback)
      }
      return {
        typeId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        code: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.deptListTree.filter(val)
    }
  },
  components: {
    AddOrUpdateType
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getMaterielTypeTreeList()
        this.getUnitList()
        this.getModelList()
        this.getSpecificationList()
        this.getMaterielTypeList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1 || data.code.indexOf(value) !== -1
    },
    addTypeHandle () {
      this.addOrUpdateTypeVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateType.init()
      })
    },
    // 所属部门树, 选中
    materielTypeTreeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.typeId = data.id
      this.dataForm.typeName = data.name + '[' + data.code + ']'
      this.materielTypeTreeListVisible = false
      this.getMaterielCode(data.id)
    },
    getMaterielCode (typeId) {
      this.$http.get(`/materiel/materiel/generateMaterielCode`, {
        params: {
          typeId: typeId
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm.code = res.data
      }).catch(() => {})
    },
    // 物料类型列表
    getMaterielTypeTreeList () {
      this.$http.get(`/materiel/materieltype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.materielTypeTreeList = res.data
      }).catch(() => {})
    },
    // 物料类型列表
    getMaterielTypeList () {
      this.$http.get(`/materiel/materieltype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.materielTypeList = res.data
      }).catch(() => {})
    },
    inquireCode (value, callback) {
      this.$http.get(`/materiel/materiel/inquireCode`, {
        params: {
          code: value,
          typeId: this.dataForm.typeId,
          id: this.dataForm.id
        }
      }).then(({ data: res }) => {
        if (res.data !== null) {
          return callback(new Error('编码重复,请重新填写！'))
        }
        callback()
      }).catch(() => {
      })
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
    // 规格列表
    getSpecificationList: function () {
      this.$http.get(`/basis/specification/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.specificationList = res.data
      }).catch(() => {
      })
    },
    // 型号列表
    getModelList: function () {
      this.$http.get(`/basis/model/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.modelList = res.data
      }).catch(() => {
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/materiel/materiel/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.materielTypeList.forEach(item => {
          if (item.id === this.dataForm.typeId) {
            this.dataForm.typeName = item.name
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/materiel/materiel/', this.dataForm).then(({ data: res }) => {
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
