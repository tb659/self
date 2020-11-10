<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="90%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '90px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据编号" prop="documentNumber">
            <el-input v-model="dataForm.documentNumber" placeholder="单据编号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据子编号" prop="documentNumberSub">
            <el-input v-model="dataForm.documentNumberSub" placeholder="单据子编号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="dataForm.projectName" placeholder="项目名称" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户姓名" prop="clientId">
            <el-select v-model="dataForm.clientId" placeholder="客户姓名" style="width: 100%" disabled>
              <el-option
                v-for="item in customInfoList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系方式" prop="documentNumber">
            <el-input v-model="dataForm.contactInformation" placeholder="单据编号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据日期" prop="documentDate">
            <el-input v-model="dataForm.documentDate" placeholder="单据日期" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table  show-summary :summary-method="getSummaries" :data="dataForm.detailList" border style="width: 100%;">
      <el-table-column header-align="center" align="center" label="序号" width="60">
        <template slot-scope="scope"> {{scope.$index+1}} </template>
      </el-table-column>
      <el-table-column prop="productCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="productName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="productSeries" show-overflow-tooltip label="构件系列" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="putOutNumber" show-overflow-tooltip label="出库数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.putOutNumber" :min="0" :max="scope.row.quantity - scope.row.outNumber" placeholder="出库数量" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="outNumber" show-overflow-tooltip label="已出库数量" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="notInNumber" show-overflow-tooltip label="未出库数量" width="100" header-align="center" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.quantity - scope.row.outNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" show-overflow-tooltip label="单价" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="amount" show-overflow-tooltip label="金额" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="taxRate" show-overflow-tooltip label="税率（%）" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="taxIncluded" show-overflow-tooltip label="含税单价" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="taxIncludedAmount" show-overflow-tooltip label="含税金额" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="specificationType" show-overflow-tooltip label="规格型号" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deptId" show-overflow-tooltip label="单位" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.deptId" filterable clearable placeholder="单位" :disabled="true">
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="buildingNo" show-overflow-tooltip label="楼号" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="floorNo" show-overflow-tooltip label="层号" width="150" header-align="center" align="center"></el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      customInfoList: [],
      specificationList: [],
      modelList: [],
      deptList: [],
      dataForm: {
        id: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        clientId: '',
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
        detailList: []
      }
    }
  },
  computed: {
    dataRule () {
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
        warehouseId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        preparedId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getCustomInfoList()
        this.getDeptList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
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
    // 单位列表
    getDeptList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
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
        let num = [4, 5, 6, 9, 12]
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
      this.$http.get(`/salesWaiting/saleswaitingoutstock/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      let obj = this.dataForm.detailList
      let flag = false
      obj.forEach(item => {
        if (!isNaN(item.putOutNumber)) {
          if (item.putOutNumber !== 0) {
            flag = true
          }
        }
      })
      if (!flag) {
        this.$message({
          message: '请至少出库一种产品',
          type: 'error',
          duration: 2000
        })
        return false
      }
      this.$http[!this.dataForm.id ? 'post' : 'put']('/salesWaiting/saleswaitingoutstock/', this.dataForm).then(({ data: res }) => {
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
  }
}
</script>
