<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="物料编码" prop="materialCoding">
        <el-input v-model="dataForm.materialCoding" :disabled="true" placeholder="物料编码"></el-input>
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input v-model="dataForm.materialName" :disabled="true" placeholder="物料名称"></el-input>
      </el-form-item>
      <el-form-item label="规格" prop="specificationId">
        <el-select v-model="dataForm.specificationId" :disabled="true" filterable clearable placeholder="规格" style="width: 100%;">
          <el-option
            v-for="item in specificationList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="型号" prop="model">
        <el-select v-model="dataForm.model" filterable :disabled="true" clearable placeholder="型号" style="width: 100%;">
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位" prop="deptId">
        <el-select v-model="dataForm.deptId" :disabled="true" filterable clearable placeholder="单位" style="width: 100%;">
          <el-option
            v-for="item in deptIdlList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" :disabled="true" type="textarea" placeholder="备注"></el-input>
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
        materialCoding: '',
        materialName: '',
        specificationId: '',
        model: '',
        quantity: '',
        remark: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        deptId: ''
      },
      modelList: [],
      specificationList: [],
      deptIdlList: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getSupplierList()
        this.getModelList()
        this.getDeptIdlList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    getDeptIdlList: function () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptIdlList = res.data
      }).catch(() => {
      })
    },
    // 规格列表
    getSupplierList: function () {
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
      this.$http.get(`/materialBasis/materialbasis/${this.dataForm.id}`).then(({ data: res }) => {
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
