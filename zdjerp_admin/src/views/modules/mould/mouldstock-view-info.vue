<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body width="68%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="模具类型" prop="typeId">
            <el-input v-model="dataForm.typeName" :readonly="true" placeholder="模具类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统编码" prop="code">
            <el-input v-model="dataForm.code" :readonly="true" placeholder="系统编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模具名称" prop="name">
            <el-input v-model="dataForm.name" :readonly="true" placeholder="模具名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="助记码" prop="mnemonicCode">
            <el-input v-model="dataForm.mnemonicCode" :readonly="true" placeholder="助记码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="dataForm.unit" :readonly="true" placeholder="设备名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模具规格" prop="specifications">
            <el-input v-model="dataForm.specifications" :readonly="true" placeholder="模具规格"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="模具适用构件" prop="applicableComponents">
            <el-input v-model="dataForm.applicableComponents" :readonly="true" placeholder="模具适用构件"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模具进场日期" prop="entryDate">
            <el-input v-model="dataForm.entryDate" :readonly="true" placeholder="模具进场日期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="dataForm.manager" :readonly="true" placeholder="负责人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="单价" prop="unitprice">
            <el-input v-model="dataForm.unitprice" :readonly="true" placeholder="单价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="金额" prop="amount">
            <el-input v-model="dataForm.amount" :readonly="true" placeholder="金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="税率" prop="taxrate">
            <el-input v-model="dataForm.taxrate" :readonly="true" placeholder="税率"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="含税单价" prop="taxunitprice">
            <el-input v-model="dataForm.taxunitprice" :readonly="true" placeholder="含税单价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="含税金额" prop="taxamount">
            <el-input v-model="dataForm.taxamount" :readonly="true" placeholder="含税金额"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="制作单位" prop="productionUnit">
        <el-input v-model="dataForm.productionUnit" :readonly="true" placeholder="制作单位"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" :readonly="true" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
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
        typeId: '',
        typeName: '',
        mouldId: '',
        code: '',
        name: '',
        mnemonicCode: '',
        unit: '',
        quantity: '',
        specifications: '',
        applicableComponents: '',
        entryDate: '',
        manager: '',
        productionUnit: '',
        unitprice: '',
        amount: '',
        taxrate: '',
        taxunitprice: '',
        taxamount: '',
        remark: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: ''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getMouldTypeList()
        this.getUnitList()
        this.getSpecificationList()
        this.getUserList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 产成品类型列表
    getMouldTypeList () {
      this.$http.get(`/mould/mouldtype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeList = res.data
      }).catch(() => {})
    },
    // 单位列表
    getUnitList: function () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.unitList = res.data
      }).catch(() => {
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
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.managerList = res.data
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/mould/mouldstock/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.mouldTypeList.forEach(item => {
          if (item.id === this.dataForm.typeId) {
            this.dataForm.typeName = item.name
          }
        })
        this.managerList.forEach(item => {
          if (item.id === this.dataForm.manager) {
            this.dataForm.manager = item.realName
          }
        })
        this.specificationList.forEach(item => {
          if (item.id === this.dataForm.specifications) {
            this.dataForm.specifications = item.name
          }
        })
        this.unitList.forEach(item => {
          if (item.id === this.dataForm.unit) {
            this.dataForm.unit = item.name
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
