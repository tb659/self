<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="打印的数据id" prop="printId">
          <el-input v-model="dataForm.printId" placeholder="打印的数据id"></el-input>
      </el-form-item>
          <el-form-item label="打印的类型" prop="printType">
          <el-input v-model="dataForm.printType" placeholder="打印的类型"></el-input>
      </el-form-item>
              <el-form-item label="修改人" prop="updater">
          <el-input v-model="dataForm.updater" placeholder="修改人"></el-input>
      </el-form-item>
          <el-form-item label="修改时间" prop="updateDate">
          <el-input v-model="dataForm.updateDate" placeholder="修改时间"></el-input>
      </el-form-item>
          <el-form-item label="删除标识（0：正常；1：已删除）" prop="delFlag">
          <el-input v-model="dataForm.delFlag" placeholder="删除标识（0：正常；1：已删除）"></el-input>
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
      dataForm: {
        id: '',
        printId: '',
        printType: '',
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
      return {
        printId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        printType: [
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
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/printrecord/printrecord/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/printrecord/printrecord/', this.dataForm).then(({ data: res }) => {
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
