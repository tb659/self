<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '100px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="版本号" prop="versionCode">
            <el-input v-model="dataForm.versionCode" maxlength="10" placeholder="版本号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本名称" prop="versionName">
            <el-input v-model="dataForm.versionName" maxlength="200" placeholder="版本名称"></el-input>
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
            <el-date-picker style="width: 100%"
                            v-model="dataForm.updateTime"
                            type="datetime"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="下载URL" prop="downloadUrl">
            <el-input v-model="dataForm.downloadUrl" placeholder="下载URL" @focus="getDownloadUrl"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
          <el-form-item label="版本说明" prop="log">
          <el-input v-model="dataForm.log" type="textarea" placeholder="版本说明" maxlength="255"></el-input>
      </el-form-item>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!--apk上传-->
    <upload-file v-if="downloadUrlVisible" ref="downloadFile" @getapkInfo="setApkUrl"></upload-file>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { checkInterNum } from '@/utils/validate'
import UploadFile from './apk-upload'
export default {
  data () {
    return {
      visible: false,
      downloadUrlVisible: false,
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
  components: {
    UploadFile
  },
  computed: {
    dataRule () {
      var validateVersionCode = (rule, value, callback) => {
        if (!checkInterNum(value)) {
          return callback(new Error('输入类型有误，请输入整数！'))
        }
        callback()
      }
      return {
        versionCode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateVersionCode, trigger: 'blur' }
        ],
        versionName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        log: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        size: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        downloadUrl: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        updater: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updateDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
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
    },
    // 获取文件的信息
    setApkUrl (apkInfo) {
      this.dataForm.downloadUrl = apkInfo.get('src')
      this.dataForm.size = apkInfo.get('size')
    },
    // 初始化弹框
    getDownloadUrl () {
      this.downloadUrlVisible = true
      this.$nextTick(() => {
        this.$refs.downloadFile.init()
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/version/version/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
