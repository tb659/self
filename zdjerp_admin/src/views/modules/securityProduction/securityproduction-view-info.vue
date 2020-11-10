<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input v-model="dataForm.title" placeholder="标题" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="摘要" prop="digest">
            <el-input v-model="dataForm.digest" placeholder="摘要" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="缩略图" prop="thumbnail">
            <el-popover placement="top-start" title="" trigger="hover">
              <img :src="dataForm.thumbnail" alt="" style="width: 150px;height: 150px">
              <img slot="reference" :src="dataForm.thumbnail" style="width: 50px;height: 50px">
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布人" prop="publisher">
            <el-input v-model="dataForm.publisher" placeholder="发布人" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="dataForm.type" style="width: 100%" disabled>
              <el-radio :label="1">整改通知</el-radio>
              <el-radio :label="2">安全培训</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布时间" prop="publishDate">
            <el-input v-model="dataForm.publishDate" placeholder="发布时间" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="明细" prop="detail">
        <u-editor ref="uEditor"/>
      </el-form-item>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script>
import UEditor from '../common/editor'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        title: '',
        digest: '',
        thumbnail: '',
        publisher: '',
        detail: '',
        type: 1,
        publishDate: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: ''
      }
    }
  },
  components: {
    UEditor
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
      this.$http.get(`/securityProduction/securityproduction/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.$refs.uEditor.content = res.data.detail
      }).catch(() => {})
    }
  }
}
</script>
