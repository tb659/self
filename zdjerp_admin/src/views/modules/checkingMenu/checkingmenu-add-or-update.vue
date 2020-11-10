<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
          <el-form-item label="检查内容名称" prop="checkName">
          <el-input v-model="dataForm.checkName" placeholder="检查内容名称" maxlength="200"></el-input>
      </el-form-item>
          <el-form-item label="类型" prop="checkType">
            <el-select v-model="dataForm.checkType" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in typeList"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
      </el-form-item>
      <el-form-item prop="parentName" label="上级名称" class="dept-list" v-if="dataForm.checkType==='3'">
        <el-popover v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="deptList"
            :props="{ label: 'checkName', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="deptListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="上级名称">
          <i
            v-if="$store.state.user.superAdmin === 1 && dataForm.pid!== '0'"
            slot="suffix"
            @click.stop="deptListTreeSetDefaultHandle()"
            class="el-icon-circle-close el-input__icon">
          </i>
        </el-input>
      </el-form-item>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      deptList: [],
      deptListVisible: false,
      dataForm: {
        id: '',
        pid: '',
        checkName: '',
        checkType: '',
        deviceId: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        parentName: ''
      },
      typeList: []
    }
  },
  computed: {
    dataRule () {
      return {
        pid: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        checkName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        checkType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        deviceId: [
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
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getTypeList(),
          this.getDeptList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          } else {
            this.deptListTreeSetDefaultHandle()
          }
        })
      })
    },
    // 获取类型列表
    getTypeList: function () {
      this.$http.get(`/sys/dict/dictList`, {
        params: {
          dictType: 'checkType'
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.typeList = res.data
      }).catch(() => {
      })
    },
    // 上级树, 设置默认值
    deptListTreeSetDefaultHandle () {
      this.dataForm.pid = '0'
      this.dataForm.parentName = '一级'
    },
    // 上级树, 选中
    deptListTreeCurrentChangeHandle (data) {
      this.dataForm.pid = data.id
      this.dataForm.parentName = data.checkName
      this.deptListVisible = false
    },
    // 获取部门列表
    getDeptList () {
      return this.$http.get('/checkingMenu/checkingmenu/list', {
        params: {
          checkType: 3,
          deviceId: this.dataForm.deviceId
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/checkingMenu/checkingmenu/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.pid === '0') {
          return this.deptListTreeSetDefaultHandle()
        }
        this.$refs.deptListTree.setCurrentKey(this.dataForm.pid)
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/checkingMenu/checkingmenu/', this.dataForm).then(({ data: res }) => {
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
