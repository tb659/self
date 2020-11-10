<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="系统编码" prop="code">
            <el-input v-model="dataForm.code" placeholder="系统编码" maxlength="50" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="设备名称" maxlength="50" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="deviceNo">
              <el-input v-model="dataForm.deviceNo" placeholder="设备编号" maxlength="50" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceTypeName">
              <el-input v-model="dataForm.deviceTypeName" :readonly="true" placeholder="设备类型"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
        <el-col :span="12">
          <el-form-item label="数量" prop="quantity">
            <el-input-number controls-position="right" v-model="dataForm.quantity" :min="1" placeholder="数量" style="width: 100%" disabled></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规格型号" prop="power">
            <el-input v-model="dataForm.specificationType" placeholder="规格型号" maxlength="225" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="助记码" prop="mnemonicCode">
            <el-input v-model="dataForm.mnemonicCode" placeholder="助记码" maxlength="200" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备功率" prop="power">
            <el-input v-model="dataForm.power" placeholder="设备功率" maxlength="225" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电压" prop="voltage">
            <el-input v-model="dataForm.voltage" placeholder="电压" maxlength="225" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产能力" prop="productionCapacity">
            <el-input v-model="dataForm.productionCapacity" placeholder="生产能力" maxlength="225" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产厂家" prop="manufactor">
            <el-input v-model="dataForm.manufactor" placeholder="生产厂家" maxlength="200" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark"  type="textarea" placeholder="备注" maxlength="200" readonly></el-input>
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
        code: '',
        name: '',
        mnemonicCode: '',
        unit: '',
        quantity: '',
        deviceNo: '',
        specifications: '',
        model: '',
        power: '',
        specificationType: '',
        voltage: '',
        productionCapacity: '',
        manufactor: '',
        subordinateDept: '',
        useDept: '',
        manager: '',
        productionUnit: '',
        remark: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: ''
      },
      articleUnitList: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getArticleUnitList()
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
    // 获取信息
    getInfo () {
      this.$http.get(`/device/device/${this.dataForm.id}`).then(({ data: res }) => {
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
