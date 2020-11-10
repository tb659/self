<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增物料分类' : '修改物料分类'" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-form-item label="物料分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="物料分类名称"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="dataForm.code"  placeholder="编码"></el-input>
      </el-form-item>
      <el-form-item label="上级分类" prop="parentName">
        <el-popover v-model="materielTypeListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="materielTypeList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="materielTypeTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="上级分类"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"></el-input>
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
      materielTypeList: [],
      materielTypeListVisible: false,
      dataForm: {
        id: '',
        name: '',
        code: '',
        pid: '',
        parentName: '',
        sort: 0
      }
    }
  },
  computed: {
    dataRule () {
      var validateCode = (rule, value, callback) => {
        this.checkCode(value, callback)
      }
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getMarerielTypeList().then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          } else if (this.$store.state.user.superAdmin === 1) {
            this.materielTypeListTreeSetDefaultHandle()
          }
        })
      })
    },
    // 获取部门列表
    getMarerielTypeList () {
      return this.$http.get('materiel/materieltype/getList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.materielTypeList = res.data
      }).catch(() => {})
    },
    checkCode (value, callback) {
      return this.$http.get(`/materiel/materieltype/checkCode/${value}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        if (res.data !== null) {
          return callback(new Error('编码重复,请重新填写！'))
        }
        callback()
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/materiel/materieltype/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.pid === '0') {
          return this.materielTypeListTreeSetDefaultHandle()
        }
        this.$refs.deptListTree.setCurrentKey(this.dataForm.pid)
      }).catch(() => {})
    },
    // 上级类型树, 设置默认值
    materielTypeListTreeSetDefaultHandle () {
      this.$refs.deptListTree.setCurrentKey(this.dataForm.pid)
      this.dataForm.parentName = this.dataForm.pid === this.$refs.deptListTree.getCurrentKey()
        ? this.$refs.deptListTree.getCurrentNode()['name']
        : ''
    },
    // 上级部门树, 选中
    materielTypeTreeCurrentChangeHandle (data) {
      this.dataForm.pid = data.id
      this.dataForm.parentName = data.name
      this.materielTypeListVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/materiel/materieltype/', this.dataForm).then(({ data: res }) => {
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
