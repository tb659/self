<template>
  <el-dialog :visible.sync="visible" title="修改" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="dataForm.projectName" placeholder="项目名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单据日期" prop="documentDate">
            <el-date-picker v-model="dataForm.documentDate" type="date" placeholder="单据日期"></el-date-picker>
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
      <el-table-column prop="productCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productCoding" placeholder="编码"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="productName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productName" placeholder="名称"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="productSeries" show-overflow-tooltip label="构件系列" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productSeries" placeholder="构件系列"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="outlineSize" show-overflow-tooltip label="外形尺寸" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.outlineSize" placeholder="外形尺寸"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deptId" show-overflow-tooltip label="单位" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deptId" placeholder="单位" v-if="false"></el-input>
          <el-input v-model="scope.row.deptName" placeholder="单位"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.quantity" :min="1" placeholder="数量" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="buildingNo" show-overflow-tooltip label="楼号" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.buildingNo" placeholder="楼号"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="floorNo" show-overflow-tooltip label="层号" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.floorNo" placeholder="层号"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" size="small" @click="showProduct()">选择成品</el-button>
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
    <!-- 产成品列表-->
    <product-list v-if="productListVisible" ref="productList" @refreshDataList="setDataList"></product-list>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import ProductList from './productList'
export default {
  data () {
    return {
      visible: false,
      productListVisible: false,
      specificationList: [],
      modelList: [],
      deptList: [],
      unitList: [],
      dataList: [],
      nums: [],
      dataForm: {
        id: '',
        contractNo: '',
        projectName: '',
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
  components: {
    ProductList
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getSpecificationList()
        this.getModelList()
        this.getDeptList()
        this.getUnitList()
        this.dataList = []
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    addRow () {
      let list = {
        productCoding: '',
        productName: '',
        productSeries: '',
        outlineSize: '',
        deptId: '',
        deptName: '',
        quantity: 1,
        remark: ''
      }
      this.dataList.unshift(list)
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
    // 单位列表
    getUnitList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.unitList = res.data
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
        if (this.dataForm.detailList.length > 0) {
          this.dataList = this.dataForm.detailList
        }
      }).catch(() => {})
    },
    showProduct: function () {
      this.productListVisible = true
      this.$nextTick(() => {
        this.$refs.productList.productList = this.dataList
        this.$refs.productList.init()
      })
    },
    // 赋值
    setDataList (res) {
      res.forEach(item => {
        var data = {}
        data['productCoding'] = item.code
        data['productName'] = item.componentName
        data['productSeries'] = item.componentSeries
        data['outlineSize'] = item.outlineSize
        data['deptId'] = item.unit
        this.unitList.forEach(unit => {
          if (unit.id === item.unit) {
            data['deptName'] = unit.name
          }
        })
        data['quantity'] = 1
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
        console.log(this.sums)
        this.dataForm.totalNumber = this.sums[6]
        this.dataForm.detailList = this.dataList
        console.log(this.dataForm)
        this.$http.put('/productionorders/productionorders/update', this.dataForm).then(({ data: res }) => {
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
    })
  }
}
</script>
