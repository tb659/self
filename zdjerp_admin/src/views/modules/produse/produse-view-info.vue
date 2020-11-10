<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="70%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
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
        <el-form-item label="生产用途" prop="teamName">
          <el-input type="textarea" v-model="dataForm.productionUse" placeholder="生产用途" :disabled="true"></el-input>
        </el-form-item>
      <el-form-item label="单据说明" prop="documentDescription">
        <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" show-summary :summary-method="getSummaries" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
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
      <el-table-column prop="putinquantity" show-overflow-tooltip label="入库数量" width="150" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
      </el-table-column>
    </el-table>
    <template slot="footer">
      <div v-if="this.dataForm.ispass === 1">
        <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      </div>
      <div v-if="this.dataForm.ispass != 1">
        <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="passHandle()">通过</el-button>
        <el-button type="primary" @click="unpassHandle()">驳回</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
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
        supplierId: '',
        contactInformation: '',
        warehouseId: '',
        preparedId: '',
        productionUse: '',
        documentDescription: '',
        totalNumber: '',
        totalTaxAmount: '',
        totalAmount: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        ispass: 1,
        list: []
      },
      dataList: [],
      supplierList: [],
      specificationList: [],
      warehouseList: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.dataList = []
        this.getSpecificationList()
        this.getSupplierList()
        this.getWarehouseList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 供应商列表
    getSpecificationList: function () {
      this.$http.get(`/basis/specification/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.specificationList = res.data
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
    // 库房列表
    getWarehouseList: function () {
      this.$http.get(`/basis/storeroom/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseList = res.data
      }).catch(() => {
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
    passHandle: function () {
      this.$http.get(`/produse/produse/pass/` + this.dataForm.id).then(({ data: res }) => {
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
      }).catch(() => {
      })
    },
    unpassHandle: function () {
      this.$http.get(`/produse/produse/unpass/` + this.dataForm.id).then(({ data: res }) => {
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
      }).catch(() => {
      })
    }
  }
}
</script>
