<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '90px'">
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
      <el-row>
        <el-col :span="24">
          <el-form-item label="单据说明" prop="documentDescription">
            <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    <el-table :data="dataList" border style="width: 100%;">
      <el-table-column header-align="center" align="center" label="序号" width="60">
        <template slot-scope="scope"> {{scope.$index+1}} </template>
      </el-table-column>
      <el-table-column prop="productCoding" show-overflow-tooltip label="编码" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="productName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="materialSeries" show-overflow-tooltip label="构件系列" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="specificationType" show-overflow-tooltip label="外形尺寸" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="unitPrice" show-overflow-tooltip label="单价" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="buildingNo" show-overflow-tooltip label="楼号" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="floorNo" show-overflow-tooltip label="层号" width="150" header-align="center" align="center"></el-table-column>
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
      },
      dataList: [],
      customInfoList: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getCustomInfoList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
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
        this.dataList = this.dataForm.detailList
      }).catch(() => {})
    }
  }
}
</script>
