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
            <div class="el-upload__tip" slot="tip">{{ $t('upload.tip', { 'format': '.apk' }) }}</div>
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
      console.log(file.type)
      if (file.type !== 'application/vnd.android.package-archive') {
        this.$message.error(this.$t('upload.tip', { 'format': '.apk' }))
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
        let apkInfo = new Map()
        let size = (file.size / 1048576).toFixed(2)
        apkInfo.set('size', size)
        apkInfo.set('src', res.data.src)
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.visible = false
            this.$emit('getapkInfo', apkInfo)
          }
        })
      }
    }
  }
}
</script>
