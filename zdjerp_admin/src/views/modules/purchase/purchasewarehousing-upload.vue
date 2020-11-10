<template>
    <el-dialog :visible.sync="visible" title="上传合同" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-upload
                :action="url"
                :file-list="fileList"
                drag
                multiple
                :before-upload="beforeUploadHandle"
                :on-success="successHandle"
                class="text-center">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" v-html="$t('upload.text')"></div>
          <div class="el-upload__tip" slot="tip">{{ $t('upload.tip', { 'format': 'jpg、png、doc/docx、xls/xlsx、pdf' }) }}</div>
        </el-upload>
    </el-dialog>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      visible: false,
      url: '',
      num: 0,
      fileList: [],
      size: '',
      id: ''
    }
  },
  methods: {
    init () {
      this.visible = true
      this.url = `${window.SITE_CONFIG['apiURL']}/sys/oss/upload?token=${Cookies.get('token')}`
      this.num = 0
      this.fileList = []
    },
    // 上传之前
    beforeUploadHandle (file) {
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'application/msword' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'application/pdf') {
        this.$message.error(this.$t('upload.tip', { 'format': 'jpg、png、doc/docx、xls/xlsx、pdf' }))
        return false
      }
      this.num++
    },
    // 上传成功
    successHandle (res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.fileList = fileList
      this.num--
      if (this.num === 0) {
        let row = new Map()
        row.set('id', this.id)
        row.set('src', res.data.src)
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.visible = false
            this.$emit('setEnclosureInfo', row)
          }
        })
      }
    }
  }
}
</script>
