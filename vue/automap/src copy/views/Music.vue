<template>
  <div>
    <!-- 音乐 -->
    {{ 12 }}
    音乐
    <div @click="getList">get请求数据</div>
    <div @click="postList">post请求数据</div>
    <div @click="putList">put请求数据</div>
    <div @click="deleteList">delete请求数据</div>
  </div>
</template>
<script>
export default {
  methods: {
    // getList() {
    //   this.httpGet('/api/user1').then(res => {
    //     console.log(res)
    //   })
    // },
    async getList() {
      const result = await this.httpGet('/api/user1')
      console.log(result)
    },
    async postList() {
      const result = await this.httpPost('/api/user2', { a: 12 })
      console.log(result)
    },
    async putList() {
      const result = await this.httpPut('/api/user3', { a: 24 })
      console.log(result)
    },
    async deleteList() {
      const result = await this.httpDelete('/api/user4')
      console.log(result)
    }
  },
  mounted() {
    console.log(this.$root)
  }
}
</script>

<style lang="scss" scoped></style>
