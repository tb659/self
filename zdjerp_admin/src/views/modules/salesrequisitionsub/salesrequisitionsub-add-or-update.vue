<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="dataForm.contractNo" placeholder="合同编号"></el-input>
      </el-form-item>
          <el-form-item label="单据日期" prop="documentDate">
          <el-input v-model="dataForm.documentDate" placeholder="单据日期"></el-input>
      </el-form-item>
          <el-form-item label="单据编号" prop="documentNumber">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号"></el-input>
      </el-form-item>
          <el-form-item label="单据子编号" prop="documentNumberSub">
          <el-input v-model="dataForm.documentNumberSub" placeholder="单据子编号"></el-input>
      </el-form-item>
          <el-form-item label="客户id" prop="clientUserId">
          <el-input v-model="dataForm.clientUserId" placeholder="客户id"></el-input>
      </el-form-item>
          <el-form-item label="联系方式" prop="contactInformation">
          <el-input v-model="dataForm.contactInformation" placeholder="联系方式"></el-input>
      </el-form-item>
          <el-form-item label="出库库房id" prop="warehouseId">
          <el-input v-model="dataForm.warehouseId" placeholder="出库库房id"></el-input>
      </el-form-item>
          <el-form-item label="制单人id" prop="preparedId">
          <el-input v-model="dataForm.preparedId" placeholder="制单人id"></el-input>
      </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="dataForm.projectName" placeholder="项目名称"></el-input>
      </el-form-item>
          <el-form-item label="单据说明" prop="documentDescription">
          <el-input v-model="dataForm.documentDescription" placeholder="单据说明"></el-input>
      </el-form-item>
          <el-form-item label="总数量" prop="totalNumber">
          <el-input v-model="dataForm.totalNumber" placeholder="总数量"></el-input>
      </el-form-item>
          <el-form-item label="总含税金额" prop="totalTaxAmount">
          <el-input v-model="dataForm.totalTaxAmount" placeholder="总含税金额"></el-input>
      </el-form-item>
          <el-form-item label="总金额" prop="totalAmount">
          <el-input v-model="dataForm.totalAmount" placeholder="总金额"></el-input>
      </el-form-item>
          <el-form-item label="审核状态（预留字段）" prop="reviewStatus">
          <el-input v-model="dataForm.reviewStatus" placeholder="审核状态（预留字段）"></el-input>
      </el-form-item>
          <el-form-item label="是否生成生产订单（0：否；1：是）" prop="productionStatus">
          <el-input v-model="dataForm.productionStatus" placeholder="是否生成生产订单（0：否；1：是）"></el-input>
      </el-form-item>
          <el-form-item label="是否生成出库单（0：否；1：是）" prop="warehouseStatus">
          <el-input v-model="dataForm.warehouseStatus" placeholder="是否生成出库单（0：否；1：是）"></el-input>
      </el-form-item>
          <el-form-item label="附件地址" prop="enclosureUrl">
          <el-input v-model="dataForm.enclosureUrl" placeholder="附件地址"></el-input>
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
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        documentNumberSub: '',
        clientUserId: '',
        contactInformation: '',
        warehouseId: '',
        preparedId: '',
        projectName: '',
        documentDescription: '',
        totalNumber: '',
        totalTaxAmount: '',
        totalAmount: '',
        reviewStatus: '',
        productionStatus: '',
        warehouseStatus: '',
        enclosureUrl: '',
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
        contractNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentNumberSub: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        clientUserId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        contactInformation: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        preparedId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentDescription: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        totalNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        totalTaxAmount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        reviewStatus: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productionStatus: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        warehouseStatus: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        enclosureUrl: [
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
      this.$http.get(`/salesrequisitionsub/salesrequisitionsub/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/salesrequisitionsub/salesrequisitionsub/', this.dataForm).then(({ data: res }) => {
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
