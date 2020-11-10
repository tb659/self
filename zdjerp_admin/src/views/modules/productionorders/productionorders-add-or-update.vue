<template>
  <el-dialog :visible.sync="visible" title="入库" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同编号" prop="contractNo">
            <el-input v-model="dataForm.contractNo" placeholder="合同编号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单据编号" prop="documentNumber">
            <el-input v-model="dataForm.documentNumber" placeholder="单据编号" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据日期" prop="documentDate">
            <el-input v-model="dataForm.documentDate" placeholder="单据日期" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总数量" prop="totalNumber">
            <el-input v-model="dataForm.totalNumber" placeholder="总数量" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="单据说明" prop="documentDescription">
        <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明" maxlength="200" readonly></el-input>
      </el-form-item>
    </el-form>
    <el-table  show-summary :summary-method="getSummaries" :data="dataForm.detailList" border style="width: 100%;">
      <el-table-column header-align="center" align="center" label="序号" width="60">
        <template slot-scope="scope"> {{scope.$index+1}} </template>
      </el-table-column>
      <el-table-column prop="materialCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productCoding" placeholder="编码" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="materialName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productName" placeholder="名称" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="materialSeries" show-overflow-tooltip label="构件系列" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productSeries" placeholder="构件系列" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="outlineSize" show-overflow-tooltip label="外形尺寸" width="150" header-align="center" align="center"></el-table-column>
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
      <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.quantity" placeholder="数量" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="putInNumber" show-overflow-tooltip label="入库数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.putInNumber" :min="0" :max="scope.row.quantity - scope.row.inNumber" placeholder="入库数量" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="inNumber" show-overflow-tooltip label="已入库数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.inNumber" placeholder="已入库数量" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="notInNumber" show-overflow-tooltip label="未入库数量" width="100" header-align="center" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.quantity - scope.row.inNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
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
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      specificationList: [],
      modelList: [],
      deptList: [],
      dataForm: {
        id: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        preparedId: '',
        documentDescription: '',
        totalNumber: '',
        inNumber: '',
        notInNumber: '',
        reviewStatus: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        detailList: []
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getSpecificationList()
        this.getModelList()
        this.getDeptList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
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
        let num = [6, 7, 9, 10]
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
      this.$http.get(`/productionorders/productionorders/${this.dataForm.id}`).then(({ data: res }) => {
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
        if (!isNaN(item.putInNumber)) {
          if (item.putInNumber !== 0) {
            flag = true
          }
        }
      })
      if (!flag) {
        this.$message({
          message: '请至少入库一种产品',
          type: 'error',
          duration: 2000
        })
        return false
      }
      this.$http[!this.dataForm.id ? 'post' : 'put']('/productionorders/productionorders/', this.dataForm).then(({ data: res }) => {
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
