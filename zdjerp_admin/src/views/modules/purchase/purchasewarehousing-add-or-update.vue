<template>
  <el-dialog :visible.sync="visible" title="采购订单入库" :close-on-click-modal="false" :close-on-press-escape="false" width="90%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同编号" prop="contractNo">
            <el-input v-model="dataForm.contractNo" placeholder="合同编号" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库库房" prop="warehouseName">
            <el-input v-model="dataForm.warehouseName" placeholder="入库库房" :disabled="true"></el-input>
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
          <el-form-item label="供应商" prop="supplierName">
            <el-input v-model="dataForm.supplierName" placeholder="供应商" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系方式" prop="contactInformation">
            <el-input v-model="dataForm.contactInformation" placeholder="联系方式" :maxlength = '11' :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="this.dataForm.id !== undefined">
          <el-form-item label="单据日期" prop="documentDate">
            <el-input v-model="dataForm.documentDate" placeholder="单据日期" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="采购类型" prop="purchaseTypeName">
            <el-input v-model="dataForm.purchaseTypeName" placeholder="单据编号" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="this.dataForm.id !== undefined">
          <el-form-item label="制单人" prop="realName">
            <el-input v-model="dataForm.realName" placeholder="制单人" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="单据说明" prop="documentDescription">
        <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明" :disabled="true"></el-input>
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
      <el-table-column prop="unitPrice" show-overflow-tooltip label="单价" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.unitPrice" :disabled="true" placeholder="单价" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="amount" show-overflow-tooltip label="金额" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.amount" placeholder="金额" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" show-overflow-tooltip label="税率（%）" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.taxRate" :disabled="true" placeholder="税率（%）" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncluded" show-overflow-tooltip label="含税单价" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxIncluded" placeholder="含税单价" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncludedAmount" show-overflow-tooltip label="含税金额" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxIncludedAmount" placeholder="含税金额" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="备注" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" fixed="right" show-overflow-tooltip label="总数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.quantity" :disabled="true" placeholder="总数量" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="入库数量" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.status === '0'">
            <el-input-number controls-position="right" v-model="scope.row.putinQuantity" :min="0" :max="scope.row.surplusQuantity" placeholder="入库数量" style="width: auto"></el-input-number>
          </div>
          <div v-if="scope.row.status === '1'">
            <el-input-number :disabled="true" controls-position="right" v-model="scope.row.putinQuantity" :min="0" :max="scope.row.surplusQuantity" placeholder="入库数量" style="width: auto"></el-input-number>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.surplusQuantity" :disabled="true" :min="0" placeholder="剩余数量" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import debounce from 'lodash/debounce'
export default {
  mixins: [mixinViewModule],
  props: ['dataList'],
  data () {
    return {
      listVisible: false,
      deptListVisible: false,
      visible: false,
      dataForm: {
        parentName: '',
        id: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
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
      supplierList: [],
      specificationList: [],
      modelList: [],
      warehouseList: []
    }
  },
  computed: {
  },
  components: {
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.dataList = []
        this.addRow()
        this.getSpecificationList()
        this.getSupplierList()
        this.getModelList()
        this.getWarehouseList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    setDataList (res) {
      this.dataList = res
    },
    amountCalculation: function (row) {
      // 金额计算，数量*单价
      if (row.putinQuantity) {
        if (row.putinQuantity > row.quantity) {
          console.log(row)
          return this.$message.error('入库数量不能大于' + row.quantity)
        }
        row.surplusQuantity = row.quantity - row.putinQuantity
      } else {
        row.surplusQuantity = row.quantity
      }
    },
    // 上级树, 选中
    deptListTreeCurrentChangeHandle (data) {
      this.dataForm.warehouseId = data.id
      this.dataForm.parentName = data.name
      this.deptListVisible = false
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
          this.$http.delete('/purchaserequisition/purchaserequisitiondetail', {
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
        materialCoding: '',
        materialName: '',
        specificationId: '',
        model: '',
        deptId: '',
        quantity: 1,
        surplusQuantity: 1,
        putinQuantity: 0,
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
        let num = [6, 8, 11]
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
      this.$http.get(`/purchasewarehousing/purchasewarehousing/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/purchasewarehousing/purchasewarehousing/', this.dataForm).then(({ data: res }) => {
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
