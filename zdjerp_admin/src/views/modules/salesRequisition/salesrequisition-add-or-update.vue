<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :before-close="handleClose" width="90%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="单据编号" prop="documentNumber">-->
            <!--<el-input v-model="dataForm.documentNumber" placeholder="单据编号" readonly></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="单据日期" prop="documentDate">
            <el-date-picker style="width: 100%"
                            v-model="dataForm.documentDate"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="dataForm.projectName" placeholder="项目名称" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="客户姓名" prop="clientUserId">
            <el-select v-model="dataForm.clientUserId" filterable clearable placeholder="客户姓名" style="width: 100%">
              <el-option
                v-for="item in customInfoList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="text" @click="addClientUserHandle()">添加客户</el-button>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="contactInformation">
            <el-input v-model="dataForm.contactInformation" placeholder="联系方式" maxlength="13"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="单据说明" prop="documentDescription">
        <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明" maxlength="200"></el-input>
      </el-form-item>
      </el-form>
    <el-table  show-summary :summary-method="getSummaries" :data="dataList" border style="width: 100%;">
      <el-table-column header-align="center" align="center" label="序号" width="60">
        <template slot-scope="scope"> {{scope.$index+1}} </template>
      </el-table-column>
      <el-table-column prop="materialCoding" show-overflow-tooltip label="编码" width="250" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.materialCoding" placeholder="编码" :readonly="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="materialName" show-overflow-tooltip label="名称" width="250" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.materialName" placeholder="名称" :readonly="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="materialSeries" show-overflow-tooltip label="构件系列" width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.materialSeries" placeholder="构件系列" :readonly="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="inventoryQuantity" show-overflow-tooltip label="库存数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
            <el-input v-model="scope.row.inventoryQuantity" placeholder="库存数量" style="width: auto" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.quantity" @change="amountCalculation(scope.row)" :min="1" placeholder="数量" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" show-overflow-tooltip label="单价" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.unitPrice" @change="amountCalculation(scope.row)" :min="0" placeholder="单价" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="amount" show-overflow-tooltip label="金额" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.amount" placeholder="金额" ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" show-overflow-tooltip label="税率（%）" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.taxRate" @change="amountCalculation(scope.row)" :min="0" :max="100" placeholder="税率（%）" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncluded" show-overflow-tooltip label="含税单价" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxIncluded" :readonly="true" placeholder="含税单价"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncludedAmount" show-overflow-tooltip label="含税金额" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxIncludedAmount" placeholder="含税金额" ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="specificationType" show-overflow-tooltip label="外形尺寸" width="250" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specificationType" placeholder="外形尺寸" :readonly="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deptId" show-overflow-tooltip label="单位id" width="150" header-align="center" align="center" v-if="false">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deptId" placeholder="单位id" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" show-overflow-tooltip label="单位" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deptName" placeholder="单位" :readonly="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="250" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="buildingNo" show-overflow-tooltip label="楼号" width="250" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.buildingNo" placeholder="楼号"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="floorNo" show-overflow-tooltip label="层号" width="250" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.floorNo" placeholder="层号"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" size="small" @click="showMaterial()">选择构件</el-button>
        </template>
        <template slot-scope="scope">
          <!--<el-button v-if="$hasPermission('purchaserequisition:purchaserequisition:update')" type="text" size="small" @click="addRow()">添加</el-button>-->
          <el-button v-if="dataList.length > 1" type="text" size="small" @click="handleDelete(scope.$index, scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="handleClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!-- 产成品列表-->
    <product-list v-if="productListVisible" ref="productList" @refreshDataList="setDataList"></product-list>
    <!--客户信息 -->
    <customInfo v-if="customInfoVisible" ref="customInfo" @refreshDataList="getCustomInfoList"></customInfo>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { isPhoneOrMobile } from '@/utils/validate'
import ProductList from './productList'
import customInfo from '../costom/custominfo-add-or-update.vue'
export default {
  data () {
    return {
      visible: false,
      productListVisible: false,
      customInfoVisible: false,
      dataForm: {
        id: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        clientUserId: '',
        contactInformation: '',
        warehouseId: '',
        preparedId: '',
        projectName: '',
        documentDescription: '',
        totalNumber: '',
        totalTaxAmount: '',
        totalAmount: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        salesRequisitionDetailList: []
      },
      dataList: [],
      unitList: [],
      specificationList: [],
      modelList: [],
      customInfoList: []
    }
  },
  computed: {
    dataRule () {
      var validateMobile = (rule, value, callback) => {
        if (value !== '') {
          if (!isPhoneOrMobile(value)) {
            return callback(new Error('联系方式格式不正确！'))
          }
          callback()
        }
        callback()
      }
      return {
        contractNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        documentNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        clientUserId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        contactInformation: [
          { required: false, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'dataForm.clientUserId': function (newValue) {
      this.customInfoList.forEach(item => {
        if (item.id === newValue) {
          this.dataForm.contactInformation = item.phone
        }
      })
    }

  },
  components: {
    ProductList, customInfo
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.dataList = []
        // this.addRow()
        // this.getSpecificationList()
        // this.getModelList()
        this.getUnitList()
        this.getCustomInfoList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
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
      this.productListVisible = true
      this.$nextTick(() => {
        // this.$refs.productList.productList = this.dataList
        this.$refs.productList.init()
      })
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
    // 添加客户
    addClientUserHandle () {
      this.customInfoVisible = true
      this.$nextTick(() => {
        this.$refs.customInfo.init()
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
    // 赋值
    setDataList (res) {
      res.forEach(item => {
        var data = {}
        data['materialCoding'] = item.code
        data['materialName'] = item.componentName
        data['materialSeries'] = item.componentSeries
        data['specificationType'] = item.outlineSize
        data['productType'] = item.typeId
        data['deptId'] = item.unit
        this.unitList.forEach(unit => {
          if (unit.id === item.unit) {
            data['deptName'] = unit.name
          }
        })
        data['inventoryQuantity'] = item.quantity
        data['quantity'] = 1
        data['unitPrice'] = item.unitprice
        data['amount'] = item.amount
        data['taxRate'] = item.taxrate
        data['taxIncluded'] = item.taxunitprice
        data['taxIncludedAmount'] = item.taxamount
        data['remark'] = item.remark
        this.dataList.push(data)
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
        materialSeries: '',
        specificationId: '',
        model: '',
        deptId: '',
        inventoryQuantity: 0,
        quantity: 0,
        unitPrice: 0,
        amount: 0,
        taxRate: 0,
        taxIncluded: 0,
        taxIncludedAmount: 0,
        remark: ''
      }
      this.dataList.unshift(list)
    },
    // 获取销售单据编号
    getDocumentNumber () {
      this.$http.get(`/numberRule/numberrule/searchkey/XSDJBH`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm.documentNumber = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/salesRequisition/salesrequisition/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.salesRequisitionDetailList.length > 0) {
          this.dataList = this.dataForm.salesRequisitionDetailList
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.totalNumber = this.sums[4]
        this.dataForm.totalAmount = this.sums[6]
        this.dataForm.totalTaxAmount = this.sums[9]
        if (this.dataList.length === 0) {
          this.$message({
            message: '构件列表不能为空！',
            type: 'error',
            duration: 2000
          })
          return false
        }
        this.dataForm.salesRequisitionDetailList = this.dataList
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
        if (!this.dataForm.id) {
          this.$http.get(`/numberRule/numberrule/searchkey/XSDJBH`).then(({ data: res }) => {
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
      this.$http[!this.dataForm.id ? 'post' : 'put']('/salesRequisition/salesrequisition/', this.dataForm).then(({ data: res }) => {
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
