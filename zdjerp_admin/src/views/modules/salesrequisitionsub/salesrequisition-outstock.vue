<template>
  <el-dialog :visible.sync="visible" title="生成出库单" :close-on-click-modal="false" :close-on-press-escape="false" width="90%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号" prop="documentNumber">
            <el-input v-model="dataForm.documentNumber" placeholder="单据编号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单据子编号" prop="documentNumberSub">
            <el-input v-model="dataForm.documentNumberSub" placeholder="单据子编号" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户姓名" prop="clientUserId">
            <el-select v-model="dataForm.clientUserId" filterable clearable placeholder="客户姓名" style="width: 100%" disabled>
              <el-option
                v-for="item in customInfoList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="contactInformation">
            <el-input v-model="dataForm.contactInformation" placeholder="联系方式" maxlength="11" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="dataForm.projectName" placeholder="项目名称" maxlength="200" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单据日期" prop="documentDate">
            <el-input v-model="dataForm.documentDate" placeholder="单据日期" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="单据说明" prop="documentDescription">
        <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明" maxlength="200" readonly></el-input>
      </el-form-item>
    </el-form>
    <el-table  show-summary :summary-method="getSummaries" :data="dataList" border style="width: 100%;">
      <el-table-column header-align="center" align="center" label="序号" width="60">
        <template slot-scope="scope"> {{scope.$index+1}} </template>
      </el-table-column>
      <el-table-column prop="materialCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="materialName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="materialSeries" show-overflow-tooltip label="构件系列" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="specificationType" show-overflow-tooltip label="外形尺寸" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deptName" show-overflow-tooltip label="单位" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deliveryQuantity" show-overflow-tooltip label="出库数量" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="总数量" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="unitPrice" show-overflow-tooltip label="单价" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="amount" show-overflow-tooltip label="金额" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="taxRate" show-overflow-tooltip label="税率（%）" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="taxIncluded" show-overflow-tooltip label="含税单价" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="taxIncludedAmount" show-overflow-tooltip label="含税金额" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="buildingNo" show-overflow-tooltip label="楼号" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="floorNo" show-overflow-tooltip label="层号" width="150" header-align="center" align="center"></el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">立即生成出库单</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        clientUserId: '',
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
        salesRequisitionSubDetailList: []
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
    getSummaries (param) {
      const { columns, data } = param
      this.sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        let num = [6, 7, 9, 12]
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
      this.$http.get(`/salesrequisitionsub/salesrequisitionsub/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.dataList = this.dataForm.salesRequisitionSubDetailList
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$http.post(`/salesrequisitionsub/salesrequisitionsub/outBoundOrder`, this.dataForm).then(({ data: res }) => {
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
