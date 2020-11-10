<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="90%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle(1)" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据编号" prop="documentNumber">
            <el-input v-model="dataForm.documentNumber" placeholder="单据编号" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dataForm.id">
          <el-form-item label="单据日期" prop="documentDate">
            <el-input v-model="dataForm.documentDate" placeholder="单据日期" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dataForm.id">
          <el-form-item label="制单人" prop="realName">
            <el-input v-model="dataForm.realName" placeholder="制单人" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="生产用途" prop="productionUse">
        <el-input type="textarea" v-model="dataForm.productionUse" placeholder="生产用途" :maxlength = '50'></el-input>
      </el-form-item>
      <el-form-item label="单据说明" prop="documentDescription">
        <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明"></el-input>
      </el-form-item>
    </el-form>
    <el-table  show-summary :summary-method="getOrderSummaries" :data="productionOrders.detailList" border style="width: 100%;">
      <el-table-column label="生产订单详情">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="productCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="productName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="productSeries" show-overflow-tooltip label="构件系列" width="150" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="outlineSize" show-overflow-tooltip label="规格型号" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deptName" show-overflow-tooltip label="单位" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="buildingNo" show-overflow-tooltip label="楼号" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="floorNo" show-overflow-tooltip label="层号" width="150" header-align="center" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <el-table v-loading="dataListLoading" show-summary :summary-method="getSummaries" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
      <el-table-column label="生产领料详情">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="materialCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.materialCoding" placeholder="编码" @focus="showMaterial()"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="materialName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.materialName" placeholder="名称" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="specificationType" show-overflow-tooltip label="规格型号" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.specificationType" placeholder="规格型号" readonly></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" show-overflow-tooltip label="单位" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deptName" placeholder="单位" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseName" show-overflow-tooltip label="库房名称" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.warehouseName" placeholder="库房名称" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" show-overflow-tooltip label="库存数量" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input-number controls-position="right" v-model="scope.row.quantity" :disabled="true" :min="0" placeholder="数量" style="width: auto"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="putinquantity" show-overflow-tooltip label="领用数量" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input-number controls-position="right" v-model="scope.row.putinquantity" :min="1" :max="scope.row.quantity" placeholder="数量" style="width: auto"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="备注" readonly></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('produse:produse:update')" type="text" size="small" @click="addRow()">添加</el-button>
            <el-button v-if="dataList.length > 1" type="text" size="small" @click="handleDelete(scope.$index, scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle(1)">{{ $t('confirm') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle(2)">保存并生成待出库单</el-button>
    </template>
    <produse-list v-if="listVisible" ref="produseList" @refreshDataList="setDataList"></produse-list>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import debounce from 'lodash/debounce'
import ProduseList from './produseList'
export default {
  mixins: [mixinViewModule],
  props: ['dataList'],
  data () {
    return {
      listVisible: false,
      deviceListVisible: false,
      laboratoryListVisible: false,
      mouldListVisible: false,
      teamListVisible: false,
      productionOrders: {},
      visible: false,
      dataForm: {
        parentName: '',
        id: '',
        productionOrdersId: '',
        documentDate: '',
        documentNumber: '',
        contactInformation: '',
        warehouseId: '',
        preparedId: '',
        workshopId: '',
        workshopName: '',
        prodline: '',
        teamId: '',
        teamName: '',
        documentDescription: '',
        totalNumber: '',
        totalAmount: '',
        productionUse: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        list: []
      },
      supplierList: [],
      deptList: [],
      specificationList: [],
      modelList: [],
      warehouseList: [],
      workshopList: [],
      teamList: [],
      purchaseTypeList: []
    }
  },
  computed: {
    dataRule () {
      return {
        documentDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        documentNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        purchaseType: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
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
    ProduseList
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.dataList = []
        this.teamList = []
        this.workshopList = []
        this.dataForm.workshopName = ''
        this.dataForm.teamName = ''
        this.addRow()
        this.getDeptList()
        this.getSpecificationList()
        this.getModelList()
        this.getWarehouseList()
        this.$refs['dataForm'].resetFields()
        console.log(this.dataForm)
        if (this.dataForm.productionOrdersId) {
          this.getProductionOrders()
        }
        if (this.dataForm.id) {
          this.getInfo()
        } else {
          this.getDocumentNumber()
        }
      })
    },
    getProductionOrders () {
      this.$http.get(`/productionorders/productionorders/${this.dataForm.productionOrdersId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productionOrders = {
          ...this.productionOrders,
          ...res.data
        }
      }).catch(() => {})
    },
    // 单位列表
    getDeptList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
    },
    getOrderSummaries (param) {
      const { columns, data } = param
      this.sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        let num = [6]
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
    // 获取单据编号
    getDocumentNumber () {
      this.$http.get(`/numberRule/numberrule/searchkey/SCLY`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm.documentNumber = res.data
      }).catch(() => {})
    },
    setDataList (res) {
      let datas = []
      res.forEach(item => {
        var data = {}
        data['materialStockId'] = item.id
        data['materialCoding'] = item.code
        data['materialName'] = item.name
        data['specificationId'] = item.specifications
        data['model'] = item.model
        data['specificationType'] = item.specificationType
        data['deptId'] = item.unit
        data['deptName'] = item.unitName
        data['warehouseId'] = item.warehouseId
        data['warehouseName'] = item.warehouseName
        data['quantity'] = item.num
        data['unitPrice'] = item.unitprice
        data['amount'] = item.amount
        data['taxRate'] = item.taxrate
        data['taxIncluded'] = item.taxunitprice
        data['taxIncludedAmount'] = item.taxamount
        data['remark'] = item.remark
        datas.push(data)
      })
      this.dataList = datas
    },
    showMaterial: function () {
      this.listVisible = true
      this.$nextTick(() => {
        this.$refs.produseList.useList = this.dataList
        this.$refs.produseList.init()
      })
    },
    amountCalculation: function (row) {
      // 金额计算，数量*单价
      if (row.putinquantity && row.unitPrice) {
        row.amount = row.putinquantity * row.unitPrice
      } else {
        row.amount = ''
      }
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
      if (id === undefined) {
        this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.dataList.splice(index, 1)
        }).catch(() => {})
      } else {
        this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.$http.delete('/produse/produsedetail', {
            'data': [id]
          }).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.dataList.splice(index, 1)
              }
            })
          }).catch(() => {})
        }).catch(() => {})
      }
    },
    addRow () {
      let list = {
        materialStockId: '',
        materialCoding: '',
        materialName: '',
        specificationId: '',
        model: '',
        deptId: '',
        warehouseId: '',
        warehouseName: '',
        quantity: 0,
        putinquantity: 1,
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
        let num = [6, 7]
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
      this.$http.get(`/produse/produse/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.dataForm.totalNumber = this.sums[7]
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
          if (!obj[i].putinquantity) {
            this.$message({
              message: '第' + (i + 1) + '行领用数量不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
          if (obj[i].quantity === 0) {
            this.$message({
              message: '第' + (i + 1) + '行' + obj[i].materialName + '库存不足，请先采购！',
              type: 'error',
              duration: 2000
            })
            return false
          }
        }
        this.dataForm['reviewStatus'] = reviewStatus
        this.$http[!this.dataForm.id ? 'post' : 'put']('/produse/produse/', this.dataForm).then(({ data: res }) => {
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
