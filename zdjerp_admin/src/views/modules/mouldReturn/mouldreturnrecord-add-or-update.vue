<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="退回id" prop="returnId">
          <el-input v-model="dataForm.returnId" placeholder="退回id"></el-input>
      </el-form-item>
          <el-form-item label="工单号" prop="workOrderCode">
          <el-input v-model="dataForm.workOrderCode" placeholder="工单号"></el-input>
      </el-form-item>
          <el-form-item label="退回时间" prop="returnTime">
          <el-input v-model="dataForm.returnTime" placeholder="退回时间"></el-input>
      </el-form-item>
          <el-form-item label="退回人" prop="returnUserId">
          <el-input v-model="dataForm.returnUserId" placeholder="退回人"></el-input>
      </el-form-item>
          <el-form-item label="退回人电话" prop="returnUserPhone">
          <el-input v-model="dataForm.returnUserPhone" placeholder="退回人电话"></el-input>
      </el-form-item>
          <el-form-item label="入库库房id" prop="warehouseId">
          <el-input v-model="dataForm.warehouseId" placeholder="入库库房id"></el-input>
      </el-form-item>
          <el-form-item label="经办人" prop="operatorId">
          <el-input v-model="dataForm.operatorId" placeholder="经办人"></el-input>
      </el-form-item>
          <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
          <el-form-item label="退回状态（字典维护）" prop="status">
          <el-input v-model="dataForm.status" placeholder="退回状态（字典维护）"></el-input>
      </el-form-item>
              <el-form-item label="修改者" prop="updater">
          <el-input v-model="dataForm.updater" placeholder="修改者"></el-input>
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
        returnId: '',
        workOrderCode: '',
        returnTime: '',
        returnUserId: '',
        returnUserPhone: '',
        warehouseId: '',
        operatorId: '',
        remark: '',
        status: '',
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
        returnId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        workOrderCode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        returnTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        returnUserId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        returnUserPhone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        operatorId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        remark: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        status: [
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
      this.$http.get(`/mouldReturn/mouldreturnrecord/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/mouldReturn/mouldreturnrecord/', this.dataForm).then(({ data: res }) => {
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
