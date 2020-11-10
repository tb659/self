<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input v-model="dataForm.title" placeholder="标题" :maxlength = '50'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="dataForm.type" style="width: 100%">
              <el-radio :label="1">整改通知</el-radio>
              <el-radio :label="2">安全培训</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="摘要" prop="digest">
        <el-input v-model="dataForm.digest" placeholder="摘要" :maxlength = '100'></el-input>
      </el-form-item>
      <el-form-item label="缩略图" prop="thumbnail">
        <el-input v-model="dataForm.thumbnail" placeholder="缩略图" @focus="getImgUrl"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发布人" prop="publisher">
            <el-input v-model="dataForm.publisher" placeholder="发布人" :maxlength = '50'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布时间" prop="publishDate">
         <el-date-picker style="width: 100%"
                        v-model="dataForm.publishDate"
                        type="datetime"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="明细" prop="detail">
        <u-editor ref="uEditor" @getContent="setIntro"/>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!--图片上传-->
    <upload-file v-if="imgUrlVisible" ref="imgFile" @getImgInfo="setImgUrl"></upload-file>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import UEditor from '../common/editor'
import UploadFile from '../common/img-list'
export default {
  data () {
    return {
      visible: false,
      imgUrlVisible: false,
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
    UEditor, UploadFile
  },
  computed: {
    dataRule () {
      return {
        title: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        digest: [
          { required: false, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        thumbnail: [
          { required: false, message: this.$t('validate.required'), trigger: 'change' }
        ],
        publisher: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        publishDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],

        detail: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        type: [
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
        this.$refs.uEditor.content = ''
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取照片文件的信息
    setImgUrl (imgUrl) {
      this.dataForm.thumbnail = imgUrl.url
    },
    // 初始化照片弹框
    getImgUrl () {
      this.imgUrlVisible = true
      this.$nextTick(() => {
        this.$refs.imgFile.init()
      })
    },
    // 为内容赋值
    setIntro (intro) {
      this.dataForm.detail = intro
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
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/securityProduction/securityproduction/', this.dataForm).then(({ data: res }) => {
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
