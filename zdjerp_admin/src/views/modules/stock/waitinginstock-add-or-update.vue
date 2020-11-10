<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="90%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="采购类型" prop="purchaseType">
            <el-select v-model="dataForm.purchaseType" filterable clearable @change="changePurchaseType" placeholder="采购类型" style="width: 100%;">
              <el-option
                v-for="item in purchaseTypeList"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库类型" prop="inType">
            <el-select v-model="dataForm.inType" filterable clearable placeholder="入库类型" style="width: 100%;">
              <el-option
                v-for="item in inTypeList"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据日期" prop="documentDate">
            <el-date-picker v-model="dataForm.documentDate" type="date" placeholder="单据日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="单据说明" prop="documentDescription">
        <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明"></el-input>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" show-summary :summary-method="getSummaries" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
      <el-table-column header-align="center" align="center" label="序号" width="60">
        <template slot-scope="scope"> {{scope.$index+1}} </template>
      </el-table-column>
      <el-table-column prop="materialCoding" show-overflow-tooltip label="物料编码" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.materialCoding" placeholder="物料编码" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="materialName" show-overflow-tooltip label="物料名称" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.materialName" placeholder="物料名称" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="specificationType" show-overflow-tooltip label="规格型号" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specificationType" placeholder="规格型号" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" show-overflow-tooltip label="单位" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deptName" placeholder="单位" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="总数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.quantity" placeholder="总数量" :precision="3" @change="amountCalculation(scope.row)" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" show-overflow-tooltip label="单价" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.unitPrice" placeholder="单价" :precision="3" @change="amountCalculation(scope.row)" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="amount" show-overflow-tooltip label="金额" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.amount" placeholder="金额"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" show-overflow-tooltip label="税率（%）" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.taxRate" placeholder="税率（%）" :precision="3" @change="amountCalculation(scope.row)" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncluded" show-overflow-tooltip label="含税单价" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxIncluded" placeholder="含税单价"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncludedAmount" show-overflow-tooltip label="含税金额" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxIncludedAmount" placeholder="含税金额" ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" size="small" @click="showMaterial()">选择原料</el-button>
        </template>
        <template slot-scope="scope">
          <el-button v-if="dataList.length > 1" type="text" size="small" @click="handleDelete(scope.$index, scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <purchaserequisition-list v-if="listVisible" ref="purchaserequisitionList" @refreshDataList="setDataList"></purchaserequisition-list>
    <!-- 一般设备 -->
    <device-list v-if="deviceListVisible" ref="deviceList" @refreshDataList="setDataList"></device-list>
    <!-- 实验室工具 -->
    <laboratory-list v-if="laboratoryListVisible" ref="laboratoryList" @refreshDataList="setDataList"></laboratory-list>
    <!-- 模具 -->
    <mould-list v-if="mouldListVisible" ref="mouldList" @refreshDataList="setDataList"></mould-list>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import debounce from 'lodash/debounce'
import PurchaserequisitionList from '../purchaseRequisition/purchaserequisitionList'
import DeviceList from '../purchaseRequisition/deviceList'
import LaboratoryList from '../purchaseRequisition/laboratoryList'
import MouldList from '../purchaseRequisition/mouldList'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      listVisible: false,
      deviceListVisible: false,
      laboratoryListVisible: false,
      mouldListVisible: false,
      deptListVisible: false,
      visible: false,
      dataForm: {
        parentName: '',
        id: '',
        purchaseType: '',
        inType: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        invoiceNumber: '',
        supplierId: '',
        contactInformation: '',
        warehouseId: '',
        warehouseName: '',
        preparedId: '',
        documentDescription: '',
        totalNumber: '',
        totalTaxAmount: '',
        totalAmount: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        list: []
      },
      purchaseTypeList: [],
      inTypeList: [],
      supplierList: [],
      specificationList: [],
      modelList: [],
      warehouseList: [],
      clickLine: '',
      unitList: [],
      dataList: []
    }
  },
  computed: {
    dataRule () {
      return {
        purchaseType: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        inType: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        documentDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        documentDescription: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    PurchaserequisitionList, DeviceList, LaboratoryList, MouldList
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.dataList = []
        this.getSpecificationList()
        this.getSupplierList()
        this.getModelList()
        this.getWarehouseList()
        this.getPurchaseType()
        this.getInType()
        this.getUnitList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    changePurchaseType () {
      this.dataList = []
    },
    amountCalculation: function (row) {
      // 金额计算，数量*单价
      if (row.quantity && row.unitPrice) {
        row.amount = row.quantity * row.unitPrice
      } else {
        row.amount = ''
      }
      // 含税单价
      if (row.taxRate && row.unitPrice && row.unitPrice) {
        row.taxIncluded = row.taxRate / 100 * row.unitPrice + row.unitPrice
      } else {
        row.taxIncluded = ''
      }
      // 含税金额
      if (row.taxRate && row.amount && row.amount) {
        row.taxIncludedAmount = row.taxRate / 100 * row.amount + row.amount
      } else {
        row.taxIncludedAmount = ''
      }
    },
    showMaterial: function () {
      if (!this.dataForm.purchaseType) {
        this.$message({
          message: '请选择采购类型',
          type: 'error',
          duration: 2000
        })
        return false
      }
      if (this.dataForm.purchaseType === '0') {
        this.listVisible = true
        this.$nextTick(() => {
          this.$refs.purchaserequisitionList.requisitionList = this.dataList
          this.$refs.purchaserequisitionList.init()
        })
      } else if (this.dataForm.purchaseType === '1') {
        this.deviceListVisible = true
        this.$nextTick(() => {
          this.$refs.deviceList.requisitionList = this.dataList
          this.$refs.deviceList.init()
        })
      } else if (this.dataForm.purchaseType === '2') {
        this.laboratoryListVisible = true
        this.$nextTick(() => {
          this.$refs.laboratoryList.requisitionList = this.dataList
          this.$refs.laboratoryList.init()
        })
      } else if (this.dataForm.purchaseType === '3') {
        this.mouldListVisible = true
        this.$nextTick(() => {
          this.$refs.mouldList.requisitionList = this.dataList
          this.$refs.mouldList.init()
        })
      }
    },
    setDataList (res) {
      console.log(res)
      res.forEach(item => {
        var data = {}
        if (this.dataForm.purchaseType === '0') { // 0=物料
          data['materialCoding'] = item.code
          data['materialName'] = item.name
          data['specificationType'] = item.outlineSize
          data['deptId'] = item.unit
          this.unitList.forEach(unit => {
            if (unit.id === item.unit) {
              data['deptName'] = unit.name
            }
          })
          data['quantity'] = item.quantity
          data['unitPrice'] = item.unitPrice
          data['amount'] = item.amount
          data['taxRate'] = item.taxRate
          data['taxIncluded'] = item.taxIncluded
          data['taxIncludedAmount'] = item.taxIncludedAmount
          data['remark'] = item.remark
          this.dataList.push(data)
        } else if (this.dataForm.purchaseType === '1') { // 1=一般设备
          data['materialCoding'] = item.deviceNo
          data['materialName'] = item.name
          data['specificationType'] = item.specificationType
          data['deptId'] = item.unit
          this.unitList.forEach(unit => {
            if (unit.id === item.unit) {
              data['deptName'] = unit.name
            }
          })
          data['quantity'] = item.quantity
          data['unitPrice'] = item.unitPrice
          data['amount'] = item.amount
          data['taxRate'] = item.taxRate
          data['taxIncluded'] = item.taxIncluded
          data['taxIncludedAmount'] = item.taxIncludedAmount
          data['remark'] = item.remark
          this.dataList.push(data)
        } else if (this.dataForm.purchaseType === '2') { // 2=实验室工具
          data['materialCoding'] = item.code
          data['materialName'] = item.name
          data['specificationType'] = item.specificationType
          data['deptId'] = item.unit
          this.unitList.forEach(unit => {
            if (unit.id === item.unit) {
              data['deptName'] = unit.name
            }
          })
          data['quantity'] = item.quantity
          data['unitPrice'] = item.unitPrice
          data['amount'] = item.amount
          data['taxRate'] = item.taxRate
          data['taxIncluded'] = item.taxIncluded
          data['taxIncludedAmount'] = item.taxIncludedAmount
          data['remark'] = item.remark
          this.dataList.push(data)
        } else if (this.dataForm.purchaseType === '3') { // 3=模具
          data['materialCoding'] = item.code
          data['materialName'] = item.name
          data['specificationType'] = item.specifications
          data['deptId'] = item.unit
          this.unitList.forEach(unit => {
            if (unit.id === item.unit) {
              data['deptName'] = unit.name
            }
          })
          data['quantity'] = item.quantity
          data['unitPrice'] = item.unitPrice
          data['amount'] = item.amount
          data['taxRate'] = item.taxRate
          data['taxIncluded'] = item.taxIncluded
          data['taxIncludedAmount'] = item.taxIncludedAmount
          data['remark'] = item.remark
          this.dataList.push(data)
        }
      })
    },
    handleDelete (index, id) { // 删除行数
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.dataList.splice(index, 1)
      }).catch(() => {})
    },
    // 单位列表
    getUnitList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.unitList = res.data
      }).catch(() => {})
    },
    getInType () {
      this.$http.get(`sys/dict/dictList`, {
        params: { dictType: 'rklx' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.inTypeList = res.data
      }).catch(() => {
      })
    },
    // 获取采购类型列表
    getPurchaseType () {
      this.$http.get(`sys/dict/dictList`, {
        params: { dictType: 'purchaseType' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.purchaseTypeList = res.data
      }).catch(() => {
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
    // 库房列表
    getWarehouseList: function () {
      this.$http.get(`/basis/storeroom/list`, {
        params: {
          status: 1
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseList = res.data
      }).catch(() => {
      })
    },
    // 供应商列表
    getSupplierList: function () {
      this.$http.get(`/supplier/supplier/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.supplierList = res.data
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
    getSummaries (param) {
      const { columns, data } = param
      this.sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        let num = [5, 7, 10]
        if (num.indexOf(index) > -1) {
          this.sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          this.sums[index] = this.sums[index]
        }
      })
      return this.sums
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/waitinginstock/waitinginstock/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.dataList = res.data.list
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.totalNumber = this.sums[6]
        this.dataForm.totalAmount = this.sums[8]
        this.dataForm.totalTaxAmount = this.sums[11]
        if (this.dataList.length === 0) {
          this.$message({
            message: '请选择原料',
            type: 'error',
            duration: 2000
          })
          return false
        }
        this.dataForm.list = this.dataList
        let obj = this.dataList
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].putinQuantity === '') {
            this.$message({
              message: '第' + (i + 1) + '行入库数量不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/waitinginstock/waitinginstock/', this.dataForm).then(({ data: res }) => {
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
