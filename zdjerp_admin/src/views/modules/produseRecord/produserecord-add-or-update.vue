<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="出库申请单id" prop="prodUseId">
          <el-input v-model="dataForm.prodUseId" placeholder="出库申请单id"></el-input>
      </el-form-item>
          <el-form-item label="单据日期" prop="documentDate">
          <el-input v-model="dataForm.documentDate" placeholder="单据日期"></el-input>
      </el-form-item>
          <el-form-item label="单据编号" prop="documentNumber">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号"></el-input>
      </el-form-item>
          <el-form-item label="出库库房id" prop="warehouseId">
          <el-input v-model="dataForm.warehouseId" placeholder="出库库房id"></el-input>
      </el-form-item>
          <el-form-item label="制单人id" prop="preparedId">
          <el-input v-model="dataForm.preparedId" placeholder="制单人id"></el-input>
      </el-form-item>
          <el-form-item label="车间ID" prop="workshopId">
          <el-input v-model="dataForm.workshopId" placeholder="车间ID"></el-input>
      </el-form-item>
          <el-form-item label="生产线" prop="prodline">
          <el-input v-model="dataForm.prodline" placeholder="生产线"></el-input>
      </el-form-item>
          <el-form-item label="生产班组" prop="teamId">
          <el-input v-model="dataForm.teamId" placeholder="生产班组"></el-input>
      </el-form-item>
          <el-form-item label="单据说明" prop="documentDescription">
          <el-input v-model="dataForm.documentDescription" placeholder="单据说明"></el-input>
      </el-form-item>
          <el-form-item label="总数量" prop="totalNumber">
          <el-input v-model="dataForm.totalNumber" placeholder="总数量"></el-input>
      </el-form-item>
          <el-form-item label="总金额" prop="totalAmount">
          <el-input v-model="dataForm.totalAmount" placeholder="总金额"></el-input>
      </el-form-item>
          <el-form-item label="审核状态（预留字段）" prop="reviewStatus">
          <el-input v-model="dataForm.reviewStatus" placeholder="审核状态（预留字段）"></el-input>
      </el-form-item>
              <el-form-item label="更新者" prop="updater">
          <el-input v-model="dataForm.updater" placeholder="更新者"></el-input>
      </el-form-item>
          <el-form-item label="更新时间" prop="updateDate">
          <el-input v-model="dataForm.updateDate" placeholder="更新时间"></el-input>
      </el-form-item>
          <el-form-item label="删除标识 0正常 1删除" prop="delFlag">
          <el-input v-model="dataForm.delFlag" placeholder="删除标识 0正常 1删除"></el-input>
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
        prodUseId: '',
        documentDate: '',
        documentNumber: '',
        warehouseId: '',
        preparedId: '',
        workshopId: '',
        prodline: '',
        teamId: '',
        documentDescription: '',
        totalNumber: '',
        totalAmount: '',
        reviewStatus: '',
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
        prodUseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        preparedId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        workshopId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        prodline: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        teamId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentDescription: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        totalNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        reviewStatus: [
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
      this.$http.get(`/produseRecord/produserecord/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/produseRecord/produserecord/', this.dataForm).then(({ data: res }) => {
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
