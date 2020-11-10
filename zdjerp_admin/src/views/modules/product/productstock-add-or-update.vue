<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="产成品类型id" prop="typeId">
          <el-input v-model="dataForm.typeId" placeholder="产成品类型id"></el-input>
      </el-form-item>
          <el-form-item label="预生产构件产品id" prop="preproductionId">
          <el-input v-model="dataForm.preproductionId" placeholder="预生产构件产品id"></el-input>
      </el-form-item>
          <el-form-item label="系统编码" prop="code">
          <el-input v-model="dataForm.code" placeholder="系统编码"></el-input>
      </el-form-item>
          <el-form-item label="构件系列" prop="componentSeries">
          <el-input v-model="dataForm.componentSeries" placeholder="构件系列"></el-input>
      </el-form-item>
          <el-form-item label="构件名称" prop="componentName">
          <el-input v-model="dataForm.componentName" placeholder="构件名称"></el-input>
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
          <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="dataForm.projectName" placeholder="项目名称"></el-input>
      </el-form-item>
          <el-form-item label="适用部位" prop="useSite">
          <el-input v-model="dataForm.useSite" placeholder="适用部位"></el-input>
      </el-form-item>
          <el-form-item label="规格" prop="specifications">
          <el-input v-model="dataForm.specifications" placeholder="规格"></el-input>
      </el-form-item>
          <el-form-item label="型号" prop="model">
          <el-input v-model="dataForm.model" placeholder="型号"></el-input>
      </el-form-item>
          <el-form-item label="标准图号" prop="standardDrawingNo">
          <el-input v-model="dataForm.standardDrawingNo" placeholder="标准图号"></el-input>
      </el-form-item>
          <el-form-item label="混凝土强度等级" prop="concreteStrengthGrade">
          <el-input v-model="dataForm.concreteStrengthGrade" placeholder="混凝土强度等级"></el-input>
      </el-form-item>
          <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
        preproductionId: '',
        code: '',
        componentSeries: '',
        componentName: '',
        mnemonicCode: '',
        unit: '',
        quantity: '',
        projectName: '',
        useSite: '',
        specifications: '',
        model: '',
        standardDrawingNo: '',
        concreteStrengthGrade: '',
        batch: '',
        castingDate: '',
        productionDate: '',
        length: '',
        width: '',
        height: '',
        qualityInspection: '',
        visualInspection: '',
        productionManager: '',
        qualityInspector: '',
        experimenter: '',
        productionUnit: '',
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
        preproductionId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        componentSeries: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        componentName: [
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
        projectName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        useSite: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        specifications: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        model: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        standardDrawingNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        concreteStrengthGrade: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        batch: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        castingDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productionDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        length: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        width: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        height: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        qualityInspection: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        visualInspection: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productionManager: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        qualityInspector: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        experimenter: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productionUnit: [
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
      this.$http.get(`/product/productstock/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/product/productstock/', this.dataForm).then(({ data: res }) => {
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
