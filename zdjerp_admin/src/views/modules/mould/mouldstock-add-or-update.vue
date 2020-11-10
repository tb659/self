<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="模具类型id" prop="typeId">
          <el-input v-model="dataForm.typeId" placeholder="模具类型id"></el-input>
      </el-form-item>
          <el-form-item label="模具id" prop="mouldId">
          <el-input v-model="dataForm.mouldId" placeholder="模具id"></el-input>
      </el-form-item>
          <el-form-item label="系统编码" prop="code">
          <el-input v-model="dataForm.code" placeholder="系统编码"></el-input>
      </el-form-item>
          <el-form-item label="模具名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="模具名称"></el-input>
      </el-form-item>
          <el-form-item label="助记码" prop="mnemonicCode">
          <el-input v-model="dataForm.mnemonicCode" placeholder="助记码"></el-input>
      </el-form-item>
          <el-form-item label="单位" prop="unit">
          <el-input v-model="dataForm.unit" placeholder="单位"></el-input>
      </el-form-item>
          <el-form-item label="数量" prop="quantity">
          <el-input v-model="dataForm.quantity" placeholder="数量"></el-input>
      </el-form-item>
          <el-form-item label="模具规格" prop="specifications">
          <el-input v-model="dataForm.specifications" placeholder="模具规格"></el-input>
      </el-form-item>
          <el-form-item label="模具适用构件" prop="applicableComponents">
          <el-input v-model="dataForm.applicableComponents" placeholder="模具适用构件"></el-input>
      </el-form-item>
          <el-form-item label="模具进场日期" prop="entryDate">
          <el-input v-model="dataForm.entryDate" placeholder="模具进场日期"></el-input>
      </el-form-item>
          <el-form-item label="负责人" prop="manager">
          <el-input v-model="dataForm.manager" placeholder="负责人"></el-input>
      </el-form-item>
          <el-form-item label="制作单位" prop="productionUnit">
          <el-input v-model="dataForm.productionUnit" placeholder="制作单位"></el-input>
      </el-form-item>
          <el-form-item label="单价" prop="unitprice">
          <el-input v-model="dataForm.unitprice" placeholder="单价"></el-input>
      </el-form-item>
          <el-form-item label="金额" prop="amount">
          <el-input v-model="dataForm.amount" placeholder="金额"></el-input>
      </el-form-item>
          <el-form-item label="税率" prop="taxrate">
          <el-input v-model="dataForm.taxrate" placeholder="税率"></el-input>
      </el-form-item>
          <el-form-item label="含税单价" prop="taxunitprice">
          <el-input v-model="dataForm.taxunitprice" placeholder="含税单价"></el-input>
      </el-form-item>
          <el-form-item label="含税金额" prop="taxamount">
          <el-input v-model="dataForm.taxamount" placeholder="含税金额"></el-input>
      </el-form-item>
          <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
        typeId: '',
        mouldId: '',
        code: '',
        name: '',
        mnemonicCode: '',
        unit: '',
        quantity: '',
        specifications: '',
        applicableComponents: '',
        entryDate: '',
        manager: '',
        productionUnit: '',
        unitprice: '',
        amount: '',
        taxrate: '',
        taxunitprice: '',
        taxamount: '',
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
      return {
        typeId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        mouldId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        mnemonicCode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        unit: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        specifications: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        applicableComponents: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        entryDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        manager: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productionUnit: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        unitprice: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        amount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        taxrate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        taxunitprice: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        taxamount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        remark: [
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
      this.$http.get(`/mould/mouldstock/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/mould/mouldstock/', this.dataForm).then(({ data: res }) => {
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
