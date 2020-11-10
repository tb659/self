<template>
  <div>
    <Tinymce :curValue="initContent" @input="newContent"></Tinymce>
  </div>
</template>
<script>
import Tinymce from '../components/Tinymce/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      initContent: '' //默认值
    }
  },
  methods: {
    newContent(val) {
      console.log(val) //获取输入内容
    }
  }
}
</script>
