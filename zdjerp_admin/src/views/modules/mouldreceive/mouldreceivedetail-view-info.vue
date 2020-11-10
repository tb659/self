<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="领取主表id" prop="receiveId">
          <el-input v-model="dataForm.receiveId" placeholder="领取主表id"></el-input>
      </el-form-item>
          <el-form-item label="模具id" prop="mouldId">
          <el-input v-model="dataForm.mouldId" placeholder="模具id"></el-input>
      </el-form-item>
          <el-form-item label="领取数量" prop="receiveNumber">
          <el-input v-model="dataForm.receiveNumber" placeholder="领取数量"></el-input>
      </el-form-item>
          <el-form-item label="领取状态（字典维护）" prop="status">
          <el-input v-model="dataForm.status" placeholder="领取状态（字典维护）"></el-input>
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
        receiveId: '',
        mouldId: '',
        receiveNumber: '',
        status: ''
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
      this.$http.get(`/mouldreceive/mouldreceivedetail/${this.dataForm.id}`).then(({ data: res }) => {
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
