<template>
  <div>
    <textarea :id="id"></textarea>
    <el-button v-if="!$route.path" style="margin-top:30px" type="primary" @click="release">立即创建</el-button>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
//这下面是tinymce的插件
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
//这里写你自己存放语言包的路径
import '../../assets/tinymce/langs/zh_CN'

export default {
  name: '',
  props: ['id', 'html'],
  data() {
    return {
      init: {
        cont: '',
        selector: '#' + this.id,
        language: 'zh_CN',
        skin_url: 'tinymce/skins/ui/oxide',
        height: 300,
        //插件
        plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
        //工具栏
        toolbar: 'bold italic underline | fontsizeselect | forecolor backcolor | bullist numlist | image',
        //隐藏tinymce的标识
        branding: false
      }
    }
  },
  methods: {
    release() {
      //content 是文本内容
      console.log(tinymce.get(this.id))
      let content = tinymce.get(this.id).getContent()
      this.$emit('release', content)
    }
  },

  watch: {
    html(next, prev) {
      tinymce.get(this.id).setContent(next)
    }
  },

  mounted() {
    //配置的初始化
    tinymce.init(this.init)
  },
  beforeDestroy() {
    //销毁
    // tinymce.get(this.id).destroy()
  }
}
</script>

<style lang="scss" scoped></style>
