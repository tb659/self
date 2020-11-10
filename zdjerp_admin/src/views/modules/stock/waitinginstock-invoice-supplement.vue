<template>
  <el-dialog :visible.sync="visible" title="采购订单入库" :close-on-click-modal="false" :close-on-press-escape="false" width="90%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
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
            <el-input v-model="dataForm.preparedName" placeholder="制单人" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="单据说明" prop="documentDescription">
        <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="发票号" prop="tag">
        <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</el-button>
      </el-form-item>
      <el-upload
        :action="url"
        :file-list="fileList"
        :on-success="handleGalleryUrl"
        :on-remove="handleRemove"
        multiple
        accept=".jpg,.jpeg,.png,.gif"
        list-type="picture-card">
        <i class="el-icon-plus"/>
      </el-upload>
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
      <el-table-column prop="quantity" show-overflow-tooltip label="总数量" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.quantity" :disabled="true" placeholder="总数量" style="width: auto"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="备注" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" fixed="right" show-overflow-tooltip label="单价" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.unitPrice" @change="amountCalculation(scope.row)" placeholder="单价" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="amount" fixed="right" show-overflow-tooltip label="金额" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.amount" placeholder="金额" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" fixed="right" show-overflow-tooltip label="税率（%）" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input-number controls-position="right" v-model="scope.row.taxRate" @change="amountCalculation(scope.row)" placeholder="税率（%）" style="width: auto"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncluded" fixed="right" show-overflow-tooltip label="含税单价" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxIncluded" placeholder="含税单价" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxIncludedAmount" fixed="right" show-overflow-tooltip label="含税金额" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.taxIncludedAmount" placeholder="含税金额" :disabled="true"></el-input>
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
import Cookies from 'js-cookie'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      listVisible: false,
      inputVisible: false,
      inputValue: '',
      deptListVisible: false,
      visible: false,
      dataForm: {
        parentName: '',
        id: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        invoiceNumber: '',
        images: '',
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
      warehouseList: [],
      dataList: [],
      dynamicTags: [],
      fileList: [],
      url: `${window.SITE_CONFIG['apiURL']}/sys/oss/upload?token=${Cookies.get('token')}`,
      dialogVisible: false,
      dialogImageUrlVisible: false,
      images: []
    }
  },
  computed: {
  },
  components: {
  },
  methods: {
    init () {
      this.visible = true
      this.fileList = []
      this.$nextTick(() => {
        this.dataList = []
        this.getSpecificationList()
        this.getSupplierList()
        this.getModelList()
        this.getWarehouseList()
        this.$refs['dataForm'].resetFields()
        this.dynamicTags = []
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    setDataList (res) {
      this.dataList = res
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
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleGalleryUrl (response, file, list) {
      if (response.code === 0) {
        this.images.push(response.data.src)
      }
      console.log()
    },
    handleRemove: function (file, list) {
      for (var i = 0; i < this.images.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
        var url
        if (file.response === undefined) {
          url = file.url
        } else {
          url = file.response.data.url
        }

        if (this.images[i] === url) {
          this.images.splice(i, 1)
        }
      }
    },
    amountCalculation: function (row) {
      // 金额计算，数量*单价
      if (row.quantity && row.unitPrice) {
        row.amount = row.quantity * row.unitPrice
      } else {
        row.amount = ''
      }
      // 含税单价
      if (row.taxRate && row.unitPrice && row.unitPrice) {
        row.taxIncluded = row.taxRate / 100 * row.unitPrice + row.unitPrice
      } else {
        row.taxIncluded = ''
      }
      // 含税金额
      if (row.taxRate && row.amount && row.amount) {
        row.taxIncludedAmount = row.taxRate / 100 * row.amount + row.amount
      } else {
        row.taxIncludedAmount = ''
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
        let num = [8, 10, 11]
        if (num.indexOf(index) > -1) {
          this.sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          this.sums[index] = this.sums[index].toFixed(2)
        }
      })
      return this.sums
    },
    // 获取信息
    getInfo () {
      this.dynamicTags = []
      this.$http.get(`/waitinginstock/waitinginstock/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.dataList = res.data.list
        if (res.data.invoiceNumber !== '') {
          this.dynamicTags = res.data.invoiceNumber.split(',')
        }
        if (this.dataForm.images != null) {
          this.images = JSON.parse(this.dataForm.images)
          for (var i = 0; i < this.images.length; i++) {
            this.fileList.push({
              url: this.images[i]
            })
          }
        } else {
          this.dataForm.images = []
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.invoiceNumber = this.dynamicTags.join(',')
        console.log(this.fileList)
        this.dataForm.images = JSON.stringify(this.images)
        this.dataForm.list = this.dataList
        this.$http[!this.dataForm.id ? 'post' : 'put']('/waitinginstock/waitinginstock/invoiceSupplement', this.dataForm).then(({ data: res }) => {
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
