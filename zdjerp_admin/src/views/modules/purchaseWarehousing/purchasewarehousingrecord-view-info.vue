<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="90%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="dataForm.contractNo" placeholder="合同编号" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="单据日期" prop="documentDate">
              <el-input v-model="dataForm.documentDate" placeholder="单据日期" :disabled="true"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="单据编号" prop="documentNumber">
            <el-input v-model="dataForm.documentNumber" placeholder="单据编号" :disabled="true"></el-input>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplierId">
          <el-input v-model="dataForm.supplierName" placeholder="供应商id" :disabled="true"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系方式" prop="contactInformation">
          <el-input v-model="dataForm.contactInformation" placeholder="联系方式" :disabled="true"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库库房" prop="warehouseId">
          <el-input v-model="dataForm.warehouseName" placeholder="入库库房" :disabled="true"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="采购类型" prop="purchaseTypeName">
            <el-input v-model="dataForm.purchaseTypeName" placeholder="单据编号" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建者" prop="creator">
          <el-input v-model="dataForm.creatorName" placeholder="创建者" :disabled="true"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="dataForm.createDate" placeholder="创建时间" :disabled="true"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    <el-table :data="dataList" border style="width: 100%;">
      <el-table-column header-align="center" align="center" label="序号" width="60">
        <template slot-scope="scope"> {{scope.$index+1}} </template>
      </el-table-column>
      <el-table-column prop="materialCoding" show-overflow-tooltip label="物料编码" style="width: auto" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="materialName" show-overflow-tooltip label="物料名称" style="width: auto" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="specificationType" show-overflow-tooltip label="规格型号" style="width: auto" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="deptName" show-overflow-tooltip label="单位" style="width: auto" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="allquantity" show-overflow-tooltip label="全部数量" style="width: auto" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="当次入库数量" style="width: auto" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="unitPrice" show-overflow-tooltip label="单价" style="width: auto" header-align="center" align="center">
      </el-table-column>
    </el-table>
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
        purchaseWarehousingId: '',
        batch: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        supplierId: '',
        contactInformation: '',
        warehouseId: '',
        preparedId: '',
        status: '',
        documentDescription: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        list: []
      },
      dataList: []
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
      this.$http.get(`/purchasewarehousingrecord/purchasewarehousingrecord/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.dataList = res.data.list
      }).catch(() => {})
    }
  }
}
</script>
