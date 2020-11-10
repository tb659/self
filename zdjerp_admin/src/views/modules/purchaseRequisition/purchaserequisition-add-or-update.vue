<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" width="90%" :before-close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle(1)" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="单据编号" prop="documentNumber">-->
            <!--<el-input v-model="dataForm.documentNumber" placeholder="单据编号" :readonly="true"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="8">
          <el-form-item label="类型" prop="purchaseType">
            <el-select v-model="dataForm.purchaseType" filterable clearable placeholder="类型" style="width: 100%;">
              <el-option
                v-for="item in purchaseTypeList"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      <!--</el-row>-->
      <!--<el-row>-->
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplierId">
            <el-select v-model="dataForm.supplierId" filterable clearable placeholder="供应商" style="width: 100%;">
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.supplierName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="text" @click="addSupplierHandle()">添加供应商</el-button>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系方式" prop="contactInformation">
            <el-input v-model="dataForm.contactInformation" placeholder="联系方式" :maxlength = '13'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据日期" prop="documentDate">
            <el-date-picker v-model="dataForm.documentDate" type="datetime" placeholder="单据日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="this.dataForm.id !== undefined">
          <el-form-item label="制单人" prop="realName">
            <el-input v-model="dataForm.realName" placeholder="制单人" :disabled="true"></el-input>
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
      <el-table-column prop="materialCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.materialCoding" placeholder="编码" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="materialName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.materialName" placeholder="名称" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="specificationType" show-overflow-tooltip label="规格型号" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specificationType" placeholder="规格型号" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deptId" show-overflow-tooltip label="单位id" width="150" header-align="center" align="center" v-if="false">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deptId" placeholder="单位id" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" show-overflow-tooltip label="单位" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deptName" placeholder="单位" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
         <!-- <div v-if="dataForm.purchaseType === '0'">
            <el-input-number controls-position="right" v-model="scope.row.quantity" @change="amountCalculation(scope.row)" :min="1" :max="9999" placeholder="数量" style="width: auto"></el-input-number>
          </div>
          <div v-if="dataForm.purchaseType != '0'">
            <el-input-number controls-position="right" v-model="scope.row.quantity" :disabled="true" :min="1" :max="9999" placeholder="数量" style="width: auto"></el-input-number>
          </div>-->
          <el-input-number controls-position="right" v-model="scope.row.quantity" :precision="3" @change="amountCalculation(scope.row)" :min="0" placeholder="数量" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" show-overflow-tooltip label="单价" width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.unitPrice" @change="amountCalculation(scope.row)" :min="0" placeholder="单价" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="amount" show-overflow-tooltip label="金额" width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.amount" :precision="2" :step="0.1" :min="0" placeholder="金额" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" show-overflow-tooltip label="税率（%）" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.taxRate" @change="amountCalculation(scope.row)" :min="0" :max="100" placeholder="税率（%）" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncluded" show-overflow-tooltip label="含税单价" width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxIncluded" readonly placeholder="含税单价"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncludedAmount" show-overflow-tooltip label="含税金额" width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.taxIncludedAmount" :precision="2" :step="0.1" :min="0" placeholder="含税金额" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" size="small" @click="showMaterial()">选择</el-button>
        </template>
        <template slot-scope="scope">
          <el-button v-if="dataList.length > 1" type="text" size="small" @click="handleDelete(scope.$index, scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="handleClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle(1)">{{ $t('confirm') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle(2)">保存并提交审核</el-button>
    </template>
    <purchaserequisition-list v-if="listVisible" ref="purchaserequisitionList" @refreshDataList="setDataList"></purchaserequisition-list>
    <!-- 一般设备 -->
    <device-list v-if="deviceListVisible" ref="deviceList" @refreshDataList="setDataList"></device-list>
    <!-- 实验室工具 -->
    <laboratory-list v-if="laboratoryListVisible" ref="laboratoryList" @refreshDataList="setDataList"></laboratory-list>
    <!-- 模具 -->
    <mould-list v-if="mouldListVisible" ref="mouldList" @refreshDataList="setDataList"></mould-list>
    <!-- 添加供应商-->
    <supplier v-if="supplierVisible" ref="supplier" @refreshDataList="getSupplierList"></supplier>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import debounce from 'lodash/debounce'
import PurchaserequisitionList from './purchaserequisitionList'
import DeviceList from './deviceList'
import LaboratoryList from './laboratoryList'
import MouldList from './mouldList'
import Supplier from '../supplier/supplier-add-or-update'
import { isPhoneOrMobile } from '@/utils/validate'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      listVisible: false,
      deviceListVisible: false,
      laboratoryListVisible: false,
      mouldListVisible: false,
      deptListVisible: false,
      supplierVisible: false,
      visible: false,
      dataForm: {
        parentName: '',
        id: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        purchaseType: '',
        supplierId: '',
        contactInformation: '',
        warehouseId: '',
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
      dataList: [],
      supplierList: [],
      unitList: [],
      warehouseList: [],
      purchaseTypeList: []
    }
  },
  watch: {
    'dataForm.supplierId': function (newValue) {
      this.supplierList.forEach(item => {
        if (item.id === newValue) {
          this.dataForm.contactInformation = item.supplierPhone
        }
      })
    }

  },
  computed: {
    dataRule () {
      var validateMobile = (rule, value, callback) => {
        if (value !== '') {
          if (!isPhoneOrMobile(value)) {
            return callback(new Error('联系方式格式不正确！'))
          }
        }
        return callback()
      }
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
        purchaseType: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        contactInformation: [
          { required: false, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        preparedId: [
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
  components: {
    PurchaserequisitionList, DeviceList, LaboratoryList, MouldList, Supplier
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.dataList = []
        this.getSupplierList()
        this.getWarehouseList()
        this.getPurchaseType()
        this.getUnitList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 添加供应商
    addSupplierHandle () {
      this.supplierVisible = true
      this.$nextTick(() => {
        this.$refs.supplier.init()
      })
    },
    // 获取单据编号
    getDocumentNumber () {
      this.$http.get(`/numberRule/numberrule/searchkey/DJBH`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm.documentNumber = res.data
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
    setDataList (res) {
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
    showMaterial: function () {
      if (!this.dataForm.purchaseType) {
        this.$message({
          message: '请选择类型',
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
    // 上级树, 选中
    deptListTreeCurrentChangeHandle (data) {
      this.dataForm.warehouseId = data.id
      this.dataForm.parentName = data.name
      this.deptListVisible = false
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
    handleDelete (index, id) { // 删除行数
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.dataList.splice(index, 1)
      }).catch(() => {})
    },
    addRow () {
      let list = {
        materialCoding: '',
        materialName: '',
        specificationType: '',
        deptId: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
        taxRate: 0,
        taxIncluded: 0,
        taxIncludedAmount: 0,
        remark: ''
      }
      this.dataList.unshift(list)
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
          this.sums[index] = this.sums[index].toFixed(3)
        }
      })
      return this.sums
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/purchaserequisition/purchaserequisition/${this.dataForm.id}`).then(({ data: res }) => {
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
    dataFormSubmitHandle: debounce(function (reviewStatus) {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.totalNumber = this.sums[5]
        this.dataForm.totalAmount = this.sums[7]
        this.dataForm.totalTaxAmount = this.sums[10]
        this.dataForm.list = this.dataList
        let obj = this.dataList
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].materialCoding === '') {
            this.$message({
              message: '第' + (i + 1) + '行物料编码参数不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
          if (!obj[i].quantity) {
            this.$message({
              message: '第' + (i + 1) + '行数量不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
        }
        this.dataForm['reviewStatus'] = reviewStatus
        if (!this.dataForm.id) {
          this.$http.get(`/numberRule/numberrule/searchkey/DJBH`).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.dataForm.documentNumber = res.data
            this.dataFormSubmit()
          }).catch(() => {})
        } else {
          this.dataFormSubmit()
        }
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    dataFormSubmit () {
      this.$http[!this.dataForm.id ? 'post' : 'put']('/purchaserequisition/purchaserequisition/', this.dataForm).then(({ data: res }) => {
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
            this.$store.state.contentIsNeedRefresh = true
            this.$nextTick(() => {
              this.$store.state.contentIsNeedRefresh = false
            })
            // window.location.reload()
          }
        })
      }).catch(() => {})
    },
    // 弹窗关闭
    handleClose () {
      this.visible = false
      this.$store.state.contentIsNeedRefresh = true
      this.$nextTick(() => {
        this.$store.state.contentIsNeedRefresh = false
      })
    }
  }
}
</script>
