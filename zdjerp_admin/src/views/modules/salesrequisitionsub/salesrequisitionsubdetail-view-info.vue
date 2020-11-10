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
          <el-form-item label="构件系列" prop="materialSeries">
          <el-input v-model="dataForm.materialSeries" placeholder="构件系列"></el-input>
      </el-form-item>
          <el-form-item label="规格" prop="specificationId">
          <el-input v-model="dataForm.specificationId" placeholder="规格"></el-input>
      </el-form-item>
          <el-form-item label="型号" prop="model">
          <el-input v-model="dataForm.model" placeholder="型号"></el-input>
      </el-form-item>
          <el-form-item label="产品类型" prop="productType">
          <el-input v-model="dataForm.productType" placeholder="产品类型"></el-input>
      </el-form-item>
          <el-form-item label="规格型号" prop="specificationType">
          <el-input v-model="dataForm.specificationType" placeholder="规格型号"></el-input>
      </el-form-item>
          <el-form-item label="单位id" prop="deptId">
          <el-input v-model="dataForm.deptId" placeholder="单位id"></el-input>
      </el-form-item>
          <el-form-item label="出库数量" prop="deliveryQuantity">
          <el-input v-model="dataForm.deliveryQuantity" placeholder="出库数量"></el-input>
      </el-form-item>
          <el-form-item label="数量" prop="quantity">
          <el-input v-model="dataForm.quantity" placeholder="数量"></el-input>
      </el-form-item>
          <el-form-item label="库存数量" prop="inventoryQuantity">
          <el-input v-model="dataForm.inventoryQuantity" placeholder="库存数量"></el-input>
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
          <el-form-item label="生成出库单状态（0：未生成；1：已生成）" prop="generateRetrievalStatus">
          <el-input v-model="dataForm.generateRetrievalStatus" placeholder="生成出库单状态（0：未生成；1：已生成）"></el-input>
      </el-form-item>
          <el-form-item label="创建者" prop="creator">
          <el-input v-model="dataForm.creator" placeholder="创建者"></el-input>
      </el-form-item>
          <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
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
        materialSeries: '',
        specificationId: '',
        model: '',
        productType: '',
        specificationType: '',
        deptId: '',
        deliveryQuantity: '',
        quantity: '',
        inventoryQuantity: '',
        unitPrice: '',
        amount: '',
        taxRate: '',
        taxIncluded: '',
        taxIncludedAmount: '',
        remark: '',
        generateRetrievalStatus: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: ''
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
      this.$http.get(`/salesrequisitionsub/salesrequisitionsubdetail/${this.dataForm.id}`).then(({ data: res }) => {
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
