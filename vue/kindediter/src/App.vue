<template>
  <div id="app">
    <editor id="editor_id" height="500px" width="700px" :content.sync="editorText" :afterChange="afterChange()" :loadStyleMode="false" @on-content-change="onContentChange"></editor>
    <div>editorTextCopy: {{ editorTextCopy }}</div>
  </div>
</template>

<script>
import editor from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    editor
  },
  data() {
    return {
      editorText: '直接初始化值', // 双向同步的变量
      editorTextCopy: '' // content-change 事件回掉改变的对象
    }
  },
  methods: {
    onContentChange(val) {
      this.editorTextCopy = val
      window.console.log(this.editorTextCopy)
    },
    afterChange() {}
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
