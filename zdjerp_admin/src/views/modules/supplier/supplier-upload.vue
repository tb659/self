<template>
    <el-dialog :visible.sync="visible" :title="$t('oss.upload')" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
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
            <div class="el-upload__tip" slot="tip"></div>
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
      size: ''
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
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.visible = false
            this.$emit('setEnclosureInfo', res.data.src)
          }
        })
      }
    }
  }
}
</script>
