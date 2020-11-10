<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '100px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="版本号" prop="versionCode">
            <el-input v-model="dataForm.versionCode" placeholder="版本号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本名称" prop="versionName">
            <el-input v-model="dataForm.versionName" placeholder="版本名称" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安装包大小" prop="size">
            <el-input v-model="dataForm.size" placeholder="安装包大小" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新时间" prop="updateTime">
            <el-input v-model="dataForm.updateTime" placeholder="更新时间" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="下载URL" prop="downloadUrl">
            <el-input v-model="dataForm.downloadUrl" placeholder="下载URL" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
          <el-form-item label="版本说明" prop="log">
          <el-input v-model="dataForm.log" type="textarea" placeholder="版本说明" readonly></el-input>
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
        versionCode: '',
        versionName: '',
        log: '',
        size: '',
        updateTime: '',
        downloadUrl: '',
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
      this.$http.get(`/version/version/${this.dataForm.id}`).then(({ data: res }) => {
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
