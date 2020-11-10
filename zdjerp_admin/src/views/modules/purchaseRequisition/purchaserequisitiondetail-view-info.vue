<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="主表id" prop="purchaseRequisitionId">
          <el-input v-model="dataForm.purchaseRequisitionId" placeholder="主表id"></el-input>
      </el-form-item>
          <el-form-item label="物料编码" prop="materialCoding">
          <el-input v-model="dataForm.materialCoding" placeholder="物料编码"></el-input>
      </el-form-item>
          <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="dataForm.materialName" placeholder="物料名称"></el-input>
      </el-form-item>
          <el-form-item label="规格" prop="specificationId">
          <el-input v-model="dataForm.specificationId" placeholder="规格"></el-input>
      </el-form-item>
          <el-form-item label="型号" prop="model">
          <el-input v-model="dataForm.model" placeholder="型号"></el-input>
      </el-form-item>
          <el-form-item label="单位id" prop="deptId">
          <el-input v-model="dataForm.deptId" placeholder="单位id"></el-input>
      </el-form-item>
          <el-form-item label="数量" prop="quantity">
          <el-input v-model="dataForm.quantity" placeholder="数量"></el-input>
      </el-form-item>
          <el-form-item label="单价" prop="unitPrice">
          <el-input v-model="dataForm.unitPrice" placeholder="单价"></el-input>
      </el-form-item>
          <el-form-item label="金额" prop="amount">
          <el-input v-model="dataForm.amount" placeholder="金额"></el-input>
      </el-form-item>
          <el-form-item label="税率" prop="taxRate">
          <el-input v-model="dataForm.taxRate" placeholder="税率"></el-input>
      </el-form-item>
          <el-form-item label="含税单价" prop="taxIncluded">
          <el-input v-model="dataForm.taxIncluded" placeholder="含税单价"></el-input>
      </el-form-item>
          <el-form-item label="含税金额" prop="taxIncludedAmount">
          <el-input v-model="dataForm.taxIncludedAmount" placeholder="含税金额"></el-input>
      </el-form-item>
          <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        purchaseRequisitionId: '',
        materialCoding: '',
        materialName: '',
        specificationId: '',
        model: '',
        deptId: '',
        quantity: '',
        unitPrice: '',
        amount: '',
        taxRate: '',
        taxIncluded: '',
        taxIncludedAmount: '',
        remark: ''
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
      this.$http.get(`/purchaserequisition/purchaserequisitiondetail/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    }
  }
}
</script>
