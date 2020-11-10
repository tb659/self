<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="物料类型" prop="typeId">
            <el-input v-model="dataForm.typeName" :readonly="true" placeholder="物料类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料编码" prop="code">
            <el-input v-model="dataForm.code" :readonly="true" placeholder="物料编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料名称" prop="name">
            <el-input v-model="dataForm.name" :readonly="true" placeholder="物料名称"></el-input>
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
          <el-form-item label="别名" prop="alias">
            <el-input v-model="dataForm.alias" :readonly="true" placeholder="别名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格型号" prop="outlineSize">
            <el-input v-model="dataForm.outlineSize" placeholder="规格型号" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="dataForm.unit" :readonly="true" placeholder="单位"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
      materielTypeList: [],
      unitList: [],
      modelList: [],
      specificationList: [],
      dataForm: {
        id: '',
        typeId: '',
        typeName: '',
        code: '',
        name: '',
        mnemonicCode: '',
        alias: '',
        unit: '',
        specifications: '',
        model: '',
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
        this.getMaterielTypeList()
        this.getUnitList()
        this.getModelList()
        this.getSpecificationList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 物料类型列表
    getMaterielTypeList () {
      this.$http.get(`/materiel/materieltype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.materielTypeList = res.data
      }).catch(() => {
      })
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
    // 获取信息
    getInfo () {
      this.$http.get(`/materiel/materiel/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.materielTypeList.forEach(item => {
          if (item.id === this.dataForm.typeId) {
            this.dataForm.typeName = item.name
          }
        })
        this.unitList.forEach(item => {
          if (item.id === this.dataForm.unit) {
            this.dataForm.unit = item.name
          }
        })
        this.specificationList.forEach(item => {
          if (item.id === this.dataForm.specifications) {
            this.dataForm.specifications = item.name
          }
        })
        this.modelList.forEach(item => {
          if (item.id === this.dataForm.model) {
            this.dataForm.model = item.name
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
