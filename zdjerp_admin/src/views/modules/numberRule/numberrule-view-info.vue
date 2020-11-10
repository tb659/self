<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
          <el-form-item label="编号名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="编号名称" readonly></el-input>
      </el-form-item>
          <el-form-item label="编号编码" prop="searchkey">
          <el-input v-model="dataForm.searchkey" placeholder="编号编码" readonly></el-input>
      </el-form-item>
          <el-form-item label="编号开始编码" prop="startKey">
          <el-input v-model="dataForm.startKey" placeholder="编号开始编码" readonly></el-input>
      </el-form-item>
          <el-form-item label="编号结尾长度" prop="endLength">
          <el-input v-model="dataForm.endLength" placeholder="编号结尾长度" readonly></el-input>
      </el-form-item>
          <el-form-item label="当前编号" prop="currentIndex">
          <el-input v-model="dataForm.currentIndex" placeholder="当前编号" readonly></el-input>
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
        name: '',
        searchkey: '',
        startKey: '',
        endLength: '',
        currentIndex: '',
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
      this.$http.get(`/numberRule/numberrule/${this.dataForm.id}`).then(({ data: res }) => {
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
