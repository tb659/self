<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备类型名称" prop="typeId">
            <el-input v-model="dataForm.deviceTypeName" placeholder="设备类型名称" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="一般设备名称" prop="deviceId">
            <el-input v-model="dataForm.deviceName" placeholder="一般设备名称" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="系统编码" prop="code">
            <el-input v-model="dataForm.code" placeholder="系统编码" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="设备名称" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="助记码" prop="mnemonicCode">
            <el-input v-model="dataForm.mnemonicCode" placeholder="助记码" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="unit">
            <el-select v-model="dataForm.unit" filterable clearable placeholder="单位" style="width: 100%" disabled>
              <el-option
                v-for="item in articleUnitList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="dataForm.quantity" placeholder="数量" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备编号" prop="deviceNo">
            <el-input v-model="dataForm.deviceNo" placeholder="设备编号" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规格型号" prop="specificationType">
            <el-input v-model="dataForm.specificationType" placeholder="规格型号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备功率" prop="power">
            <el-input v-model="dataForm.power" placeholder="设备功率" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产能力" prop="productionCapacity">
            <el-input v-model="dataForm.productionCapacity" placeholder="生产能力" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电压" prop="voltage">
            <el-input v-model="dataForm.voltage" placeholder="电压" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产厂家" prop="manufactor">
            <el-input v-model="dataForm.manufactor" placeholder="生产厂家" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制作单位" prop="productionUnit">
            <el-input v-model="dataForm.productionUnit" placeholder="制作单位" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="subordinateDept">
            <el-input v-model="dataForm.subordinateDeptName" placeholder="所属部门" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用部门" prop="useDept">
            <el-input v-model="dataForm.useDeptName" placeholder="使用部门" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人" prop="manager">
            <el-select v-model="dataForm.manager" placeholder="负责人" style="width: 100%" disabled>
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单价" prop="unitprice">
            <el-input v-model="dataForm.unitprice" placeholder="单价" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="税率" prop="taxrate">
            <el-input v-model="dataForm.taxrate" placeholder="税率" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="金额" prop="amount">
            <el-input v-model="dataForm.amount" placeholder="金额" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="含税金额" prop="taxamount">
            <el-input v-model="dataForm.taxamount" placeholder="含税金额" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="含税单价" prop="taxunitprice">
            <el-input v-model="dataForm.taxunitprice" placeholder="含税单价" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
      </el-row>
          <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" placeholder="备注" readonly></el-input>
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
        deviceId: '',
        code: '',
        name: '',
        mnemonicCode: '',
        deviceName: '',
        unit: '',
        quantity: '',
        deviceNo: '',
        specifications: '',
        model: '',
        power: '',
        voltage: '',
        productionCapacity: '',
        manufactor: '',
        subordinateDept: '',
        useDept: '',
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
        updateDate: '',
        updater: '',
        specificationType: '',
        delFlag: ''
      },
      articleUnitList: [],
      userList: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getArticleUnitList(),
          this.getUserList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取物品单位列表
    getArticleUnitList () {
      return this.$http.get('/articleUnit/articleunit/list', {
        params: {
          status: 1
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.articleUnitList = res.data
      }).catch(() => {})
    },
    // 用户列表
    getUserList: function () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/device/devicestock/${this.dataForm.id}`).then(({ data: res }) => {
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
