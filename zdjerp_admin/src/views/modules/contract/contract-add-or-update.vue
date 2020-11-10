<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="合同名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="合同名称"></el-input>
      </el-form-item>
      <el-form-item label="附件地址" prop="enclosureUrl">
        <el-input v-model="dataForm.enclosureUrl" placeholder="附件地址" @focus="contractHandle"></el-input>
      </el-form-item>
      <el-form-item label="合同描述" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="合同描述"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!--附件上传-->
    <enclosure-file v-if="enclosureUrlVisible" ref="enclosureFile" @setEnclosureInfo="setEnclosureUrl"></enclosure-file>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import EnclosureFile from '../salesRequisition/salesrequisition-upload'
export default {
  data () {
    return {
      visible: false,
      enclosureUrlVisible: false,
      dataForm: {
        id: '',
        orderId: '',
        contractNo: '',
        name: '',
        type: '',
        enclosureUrl: '',
        remark: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: ''
      }
    }
  },
  components: {
    EnclosureFile
  },
  computed: {
    dataRule () {
      return {
        orderId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        contractNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        type: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        enclosureUrl: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
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
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/contract/contract/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    contractHandle () {
      this.enclosureUrlVisible = true
      this.$nextTick(() => {
        this.$refs.enclosureFile.init()
      })
    },
    setEnclosureUrl (enclosureUrl) {
      this.dataForm.enclosureUrl = enclosureUrl
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/contract/contract/', this.dataForm).then(({ data: res }) => {
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
