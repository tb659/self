<template>
  <HelloWorld msg="Welcome to Your Vue.js App" />
  <div>{{ age }}</div>
  <div>{{ title }}</div>
  <div>{{ gender }}</div>
  <button @click="age++">添加</button>
  <button @click="add">add</button>
  <button @click="minus">minus</button>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {
  reactive,
  ref,
  // render,
  // watch,
  // computed
} from 'vue'
export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  setup() {
    const age = 18
    let title = reactive({ name: '王二狗' })
    const gender = ref('男')
    gender.value = '女'
    const add = () =>{
      console.log(gender.value = '男')
    }
    const minus = () =>{
      console.log(title = reactive({ name: '王二狗1' }))
    }
    return {
      age,
      title,
      gender,
      add,
      minus
    }
  }
}
</script>
