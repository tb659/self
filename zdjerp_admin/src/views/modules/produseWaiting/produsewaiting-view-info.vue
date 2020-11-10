<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="70%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据编号" prop="documentNumber">
            <el-input v-model="dataForm.documentNumber" placeholder="单据编号" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="this.dataForm.id !== undefined">
          <el-form-item label="单据日期" prop="documentDate">
            <el-input v-model="dataForm.documentDate" placeholder="单据日期" :disabled="true"></el-input>
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
    <el-table show-summary :summary-method="getSummaries" :data="dataList" border style="width: 100%;">
      <el-table-column header-align="center" align="center" label="序号" width="60">
        <template slot-scope="scope"> {{scope.$index+1}} </template>
      </el-table-column>
      <el-table-column prop="materialCoding" show-overflow-tooltip label="物料编码" width="150" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="materialName" show-overflow-tooltip label="物料名称" width="150" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="specificationType" show-overflow-tooltip label="规格型号" width="150" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="deptName" show-overflow-tooltip label="单位" width="150" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="库存数量" width="150" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="putinquantity" show-overflow-tooltip label="出库数量" width="150" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
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
      this.$http.get(`/produseWaiting/produsewaiting/${this.dataForm.id}`).then(({ data: res }) => {
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
    getSummaries (param) {
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
    }
  }
}
</script>
