<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="url"
      name="img"
      :headers="header"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload">
    </el-upload>
    <el-button style="display: none" class="uploadPic" @click="uploadPic"></el-button>
    <el-upload
      class="avatar-uploader"
      :action="url"
      name="img"
      :headers="header"
      :show-file-list="false"
      :on-success="uploadVideoSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload">
    </el-upload>
    <el-button style="display: none" class="uploadVideo" @click="uploadVideo"></el-button>
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @change="onEditorChange($event)"
    >
    </quill-editor>
    <!-- 弹窗, 上传文件 -->
    <upload-file v-if="uploadVisible" ref="uploadFile" @getImgInfo="getImgNamesAndUrl"/>
    <!-- 弹窗，上传视频 -->
    <upload-video v-if="uploadVideoVisible" ref="uploadVideo" @getVideoInfo="getVideoNamesAndUrl"/>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import UploadFile from '../common/img-list'
import UploadVideo from './video-list'
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  [{ 'header': 1 }, { 'header': 2 }], // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
  [{ 'direction': 'rtl' }], // text direction
  [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean']

]
export default {
  data () {
    return {
      uploadVisible: false,
      uploadVideoVisible: false,
      url: `${window.SITE_CONFIG['apiURL']}/sys/oss/upload?token=${Cookies.get('token')}`,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      content: '',
      dataForm: {
        index: ''
      },
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.uploadPic').click()
                  // 触发input框选择图片文件
                  // document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              },
              'video': function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.uploadVideo').click()
                  // 触发input框选择图片文件
                  // document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('video', false)
                }
              }
            }
          }
        }
      },
      serverUrl: '/manager/common/imgUpload', // 这里写你要上传的图片服务器地址
      header: {
        // token: sessionStorage.token
      } // 有的图片服务器要求请求头需要有token
    }
  },
  components: {
    UploadFile, UploadVideo
  },
  methods: {
    onEditorChange ({ editor, html, text }) { // 内容改变事件
      this.content = html
      this.$emit('getContent', html)
    },
    // 富文本图片上传前
    beforeUpload () {
      // 显示loading动画
      this.quillUpdateImg = true
    },
    uploadSuccess (res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      console.log(res)
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.code === 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    uploadVideoSuccess (res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.code === 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, 'video', res.url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('视频插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    // 富文本图片上传失败
    uploadError () {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('插入失败')
    },
    // 图片列表
    uploadPic () {
      this.dataForm.index = this.$refs.myQuillEditor.quill.getSelection().index
      console.info(this.dataForm.index)
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.uploadFile.init()
      })
    },
    uploadVideo () {
      this.dataForm.index = this.$refs.myQuillEditor.quill.getSelection().index
      this.uploadVideoVisible = true
      this.$nextTick(() => {
        this.$refs.uploadVideo.init()
      })
    },
    // 获取图片上传路径
    getImgNamesAndUrl (row) {
      let quill = this.$refs.myQuillEditor.quill
      // 插入图片  res.url为服务器返回的图片地址
      quill.insertEmbed(this.dataForm.index, 'image', row.url)
      // 调整光标到最后
      quill.setSelection(this.dataForm.index + 1)
    },
    getVideoNamesAndUrl (row) {
      let quill = this.$refs.myQuillEditor.quill
      // 插入图片  res.url为服务器返回的图片地址
      quill.insertEmbed(this.dataForm.index, 'video', row.url)
      // 调整光标到最后
      quill.setSelection(this.dataForm.index + 1)
    }
  }
}
</script>
<style>
  video {
    width: 200px;
  }
  .quill-editor {
    height: 345px;
  }
  .ql-container {
    height: 280px;
  }
  .aui-content .ql-container {
    height: 320px;
  }
  .ql-editor.ql-blank, .ql-editor {
    height: 220px;
  }
  .editor {
    line-height: normal !important;
    height: 800px;
  }
  .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
  }
  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
  }

  .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
  }
  .avatar-uploader{
    display: none;
  }
</style>
