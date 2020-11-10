<template>
  <div>
    <!-- 音乐 -->
    音乐
    <div @click="getList">get请求数据</div>
    <div @click="postList">post请求数据</div>
    <div @click="putList">put请求数据</div>
    <div @click="deleteList">delete请求数据</div>
    <br />

    <el-upload action="/api/img" list-type="picture-card" :on-remove="handleRemove" :on-success="uploadSuccess">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>
<script>
export default {
  methods: {
    async uploadSuccess(res, file, fileList) {
      console.log(res, file, fileList)
    },

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },

    async getList() {
      // this.$http.get('http://localhost:1234/user1').then(res => {
      //   console.log(res)
      // })
      const result = await this.$http.user1.getUser1({ a: 2 })
      console.log(result)
    },
    async postList() {
      const result = await this.$http.user2.getUser2({ a: 12 })
      console.log(result)
    },
    async putList() {
      const result = await this.$http.user3.getUser3({ a: 22 })
      console.log(result)
    },
    async deleteList() {
      const result = await this.$http.user4.getUser4({ a: 32 })
      console.log(result)
    }
  }
}
</script>

<style lang="scss" scoped></style>
