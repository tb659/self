<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="销售订单id/采购订单id" prop="orderId">
          <el-input v-model="dataForm.orderId" placeholder="销售订单id/采购订单id"></el-input>
      </el-form-item>
          <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="dataForm.contractNo" placeholder="合同编号"></el-input>
      </el-form-item>
          <el-form-item label="合同名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="合同名称"></el-input>
      </el-form-item>
          <el-form-item label="合同类型（1：销售合同；2：采购合同）" prop="type">
          <el-input v-model="dataForm.type" placeholder="合同类型（1：销售合同；2：采购合同）"></el-input>
      </el-form-item>
          <el-form-item label="附件地址" prop="enclosureUrl">
          <el-input v-model="dataForm.enclosureUrl" placeholder="附件地址"></el-input>
      </el-form-item>
          <el-form-item label="合同描述" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="合同描述"></el-input>
      </el-form-item>
          <el-form-item label="创建人" prop="creator">
          <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
      </el-form-item>
          <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
      </el-form-item>
          <el-form-item label="修改人" prop="updater">
          <el-input v-model="dataForm.updater" placeholder="修改人"></el-input>
      </el-form-item>
          <el-form-item label="修改时间" prop="updateDate">
          <el-input v-model="dataForm.updateDate" placeholder="修改时间"></el-input>
      </el-form-item>
          <el-form-item label="删除标识（0：正常；1：删除）" prop="delFlag">
          <el-input v-model="dataForm.delFlag" placeholder="删除标识（0：正常；1：删除）"></el-input>
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
        orderId: '',
        contractNo: '',
        name: '',
        type: '',
        enclosureUrl: '',
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
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/contract/contract/${this.dataForm.id}`).then(({ data: res }) => {
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
