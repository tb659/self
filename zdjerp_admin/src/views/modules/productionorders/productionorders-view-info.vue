<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号" prop="documentNumber">
            <el-input v-model="dataForm.documentNumber" placeholder="单据编号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单据日期" prop="documentDate">
            <el-input v-model="dataForm.documentDate" placeholder="单据日期" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
      <el-table-column prop="productCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="productName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="productSeries" show-overflow-tooltip label="构件系列" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="outlineSize" show-overflow-tooltip label="外形尺寸" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deptId" show-overflow-tooltip label="单位" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <template v-for="item in deptList">
            <template v-if="item.id === scope.row.deptId">{{item.name}}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="inNumber" show-overflow-tooltip label="已入库数量" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="notInNumber" show-overflow-tooltip label="未入库数量" width="100" header-align="center" align="center">
        <template slot-scope="scope">
          {{scope.row.quantity - scope.row.inNumber}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="buildingNo" show-overflow-tooltip label="楼号" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="floorNo" show-overflow-tooltip label="层号" width="150" header-align="center" align="center"></el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button v-if="$hasPermission('productionorders:productionorders:pass')&&this.isPass === 1" type="primary" @click="confirmHandle">通过</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
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
      },
      isPass: 0
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getDeptList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    confirmHandle (id) {
      this.$http.get(`/productionorders/productionorders/pass/` + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
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
        let num = [6, 7, 8]
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
    }
  }
}
</script>
