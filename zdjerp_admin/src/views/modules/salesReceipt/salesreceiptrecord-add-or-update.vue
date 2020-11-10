<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="销售出库表id" prop="salesReceiptId">
          <el-input v-model="dataForm.salesReceiptId" placeholder="销售出库表id"></el-input>
      </el-form-item>
          <el-form-item label="批次" prop="batch">
          <el-input v-model="dataForm.batch" placeholder="批次"></el-input>
      </el-form-item>
          <el-form-item label="单据日期" prop="documentDate">
          <el-input v-model="dataForm.documentDate" placeholder="单据日期"></el-input>
      </el-form-item>
          <el-form-item label="单据编号" prop="documentNumber">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号"></el-input>
      </el-form-item>
          <el-form-item label="客户id" prop="clientUserId">
          <el-input v-model="dataForm.clientUserId" placeholder="客户id"></el-input>
      </el-form-item>
          <el-form-item label="联系方式" prop="contactInformation">
          <el-input v-model="dataForm.contactInformation" placeholder="联系方式"></el-input>
      </el-form-item>
          <el-form-item label="制单人id" prop="preparedId">
          <el-input v-model="dataForm.preparedId" placeholder="制单人id"></el-input>
      </el-form-item>
          <el-form-item label="出库库房" prop="outWarehouseId">
          <el-input v-model="dataForm.outWarehouseId" placeholder="出库库房"></el-input>
      </el-form-item>
          <el-form-item label="送货地址" prop="deliveryAddress">
          <el-input v-model="dataForm.deliveryAddress" placeholder="送货地址"></el-input>
      </el-form-item>
          <el-form-item label="联系电话" prop="contactNumber">
          <el-input v-model="dataForm.contactNumber" placeholder="联系电话"></el-input>
      </el-form-item>
          <el-form-item label="单据说明" prop="documentDescription">
          <el-input v-model="dataForm.documentDescription" placeholder="单据说明"></el-input>
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
        salesReceiptId: '',
        batch: '',
        documentDate: '',
        documentNumber: '',
        clientUserId: '',
        contactInformation: '',
        preparedId: '',
        outWarehouseId: '',
        deliveryAddress: '',
        contactNumber: '',
        documentDescription: '',
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
        salesReceiptId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        batch: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        clientUserId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        contactInformation: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        preparedId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        outWarehouseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        deliveryAddress: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentDescription: [
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
      this.$http.get(`/salesReceipt/salesreceiptrecord/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/salesReceipt/salesreceiptrecord/', this.dataForm).then(({ data: res }) => {
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
