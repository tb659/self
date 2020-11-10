<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '100px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据日期" prop="documentDate">
            <el-input v-model="dataForm.documentDate" placeholder="单据日期" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据编号" prop="documentNumber">
            <el-input v-model="dataForm.documentNumber" placeholder="单据编号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户姓名" prop="clientUserId">
            <el-select v-model="dataForm.clientUserId" placeholder="客户姓名" style="width: 100%" disabled>
              <el-option
                v-for="item in customInfoList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="单据说明" prop="documentDescription">
            <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table :data="dataList" border style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="materialCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.materialCoding" placeholder="编码" readonly></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="materialName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.materialName" placeholder="名称" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="specificationId" show-overflow-tooltip label="规格" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.specificationId" filterable clearable placeholder="规格" :disabled="true">
              <el-option
                v-for="item in specificationList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="model" show-overflow-tooltip label="型号" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.model" filterable clearable placeholder="型号" :disabled="true">
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quantity" :min="1" placeholder="数量" style="width: auto" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" show-overflow-tooltip label="单价" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.unitPrice"  :min="0" placeholder="单价" style="width: auto" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="备注" readonly></el-input>
          </template>
        </el-table-column>
      </el-table>
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
        delFlag: '',
        salesReceiptRecordDetailList: []
      },
      dataList: [],
      specificationList: [],
      modelList: [],
      customInfoList: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getSpecificationList(),
          this.getModelList(),
          this.getCustomInfoList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 规格列表
    getSpecificationList: function () {
      this.$http.get(`/basis/specification/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.specificationList = res.data
      }).catch(() => {
      })
    },
    // 客户列表
    getCustomInfoList: function () {
      this.$http.get(`/salesRequisition/salesrequisition/findAllCustomlist`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.customInfoList = res.data
      }).catch(() => {
      })
    },
    // 型号列表
    getModelList: function () {
      this.$http.get(`/basis/model/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.modelList = res.data
      }).catch(() => {
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
        this.dataList = this.dataForm.salesReceiptRecordDetailList
      }).catch(() => {})
    }
  }
}
</script>
