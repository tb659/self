<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="编号名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="编号名称" maxlength="50"></el-input>
      </el-form-item>
          <el-form-item label="编号编码" prop="searchkey">
          <el-input v-model="dataForm.searchkey" placeholder="编号编码" maxlength="50"></el-input>
      </el-form-item>
          <el-form-item label="开始编码" prop="startKey">
          <el-input v-model="dataForm.startKey" placeholder="编号开始编码" maxlength="10"></el-input>
      </el-form-item>
          <el-form-item label="结尾长度" prop="endLength">
          <el-input v-model="dataForm.endLength" placeholder="编号结尾长度" maxlength="1"></el-input>
      </el-form-item>
          <el-form-item label="当前编号" prop="currentIndex">
          <el-input v-model="dataForm.currentIndex" placeholder="当前编号" readonly></el-input>
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
        name: '',
        searchkey: '',
        startKey: '',
        endLength: '',
        currentIndex: '',
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
      var checkCurrentIndex = (rule, value, callback) => {
        let reg = '^[1-9]\\d*$'
        if (!new RegExp(reg).test(value)) {
          return callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        searchkey: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        startKey: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        endLength: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: checkCurrentIndex, trigger: 'blur' }
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
      this.$http.get(`/numberRule/numberrule/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/numberRule/numberrule/', this.dataForm).then(({ data: res }) => {
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
