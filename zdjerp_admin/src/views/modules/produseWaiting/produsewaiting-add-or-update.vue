<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据日期" prop="documentDate">
            <el-date-picker v-model="dataForm.documentDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出库类型" prop="outType">
            <el-select v-model="dataForm.outType" placeholder="出库类型">
              <el-option :value="0" label="生产领料"></el-option>
              <el-option :value="1" label="其他"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="单据说明" prop="documentDescription">
        <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明"></el-input>
      </el-form-item>
    </el-form>
    <el-table show-summary :summary-method="getSummaries" :data="dataList" border style="width: 100%;">
      <el-table-column header-align="center" align="center" label="序号" width="60">
        <template slot-scope="scope"> {{scope.$index+1}} </template>
      </el-table-column>
      <el-table-column prop="materialCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.materialStockId" v-if="false"></el-input>
          <el-input v-model="scope.row.materialCoding" placeholder="编码" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="materialName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.materialName" placeholder="名称" :readonly="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="specificationType" show-overflow-tooltip label="规格型号" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specificationType" :readonly="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" show-overflow-tooltip label="单位" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deptName" placeholder="单位" :readonly="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="库存数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.quantity" :readonly="true" placeholder="数量"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="备注" :readonly="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="putinquantity" fixed="right" show-overflow-tooltip label="领取数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.putinquantity" :precision="3" :min="1" :max="scope.row.quantity" placeholder="领取数量" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column fixed="right" show-overflow-tooltip label="操作" width="150" header-align="center" align="center">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" size="small" @click="showMaterial()">选择原料</el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <materiel-stock-list v-if="materielStockListVisible" ref="materielStockList" @setDataList="setDataList"></materiel-stock-list>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import MaterielStockList from './materielstockList'
export default {
  data () {
    return {
      visible: false,
      materielStockListVisible: false,
      dataForm: {
        id: '',
        documentDate: '',
        documentNumber: '',
        warehouseId: '',
        preparedId: '',
        workshopId: '',
        prodline: '',
        teamId: '',
        documentDescription: '',
        totalNumber: '',
        totalAmount: '',
        reviewStatus: '',
        outType: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        list: []
      },
      dataList: [],
      specificationList: [],
      modelList: [],
      warehouseList: [],
      workshopList: [],
      teamList: []
    }
  },
  components: {
    MaterielStockList
  },
  computed: {
    dataRule () {
      return {
        documentDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        outType: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        documentNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        preparedId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        workshopId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        teamId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        totalNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        reviewStatus: [
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
    amountCalculation: function (row) {
      // 金额计算，数量*单价
      if (row.putinquantity && row.unitPrice) {
        row.amount = row.putinquantity * row.unitPrice
      } else {
        row.amount = ''
      }
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
        let num = [7]
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
      this.$http.get(`/produseWaiting/produsewaiting/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        console.log(res.data)
        this.dataList = res.data.list
      }).catch(() => {})
    },
    showMaterial () {
      this.materielStockListVisible = true
      this.$nextTick(() => {
        this.$refs.materielStockList.materielList = this.dataList
        this.$refs.materielStockList.init()
      })
    },
    // 赋值
    setDataList (res) {
      res.forEach(item => {
        var data = {}
        data['materialStockId'] = item.id
        data['materialCoding'] = item.code
        data['materialName'] = item.name
        data['specificationType'] = item.specificationType
        data['deptId'] = item.unit
        data['deptName'] = item.unitName
        data['quantity'] = item.num
        data['remark'] = item.remark
        this.dataList.push(data)
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
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        let obj = this.dataList
        if (this.dataList.length === 0) {
          this.$message({
            message: '领取物料不能为空！',
            type: 'error',
            duration: 2000
          })
          return false
        }
        for (let i = 0; i < obj.length; i++) {
          console.log(obj[i].putinquantity)
          if (obj[i].putinquantity === '') {
            this.$message({
              message: '第' + (i + 1) + '行领取数量不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
        }
        this.dataForm.list = this.dataList
        this.$http[!this.dataForm.id ? 'post' : 'put']('/produseWaiting/produsewaiting/', this.dataForm).then(({ data: res }) => {
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
