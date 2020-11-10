<template>
  <div>
    <div class="block">
      <el-carousel height="650px">
        <el-carousel-item>
          <img
            width="100%" height="100%"
            src="https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS9lYzU5MzllZTI0MzE2ODQxZGYyYmQ5MzgxYmM3YjJhMS5qcGc_p_p100_p_3D.jpg"
            alt
          />
        </el-carousel-item>
        <el-carousel-item>
          <img
            width="100%"  height="100%"
            src="https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS9jMmFmMzc5ZGMwNmQwMTA0OTRmYmU1ZmZjNzA0NzhkMS5qcGc_p_p100_p_3D.jpg"
            alt
          />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>