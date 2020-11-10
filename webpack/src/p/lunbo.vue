<template>
  <div class="block">
    <span
      @click="type=!type"
      :class="type?'el-icon-video-pause':'el-icon-video-play'"
      style="position:absolute;left:50%;top:10%;transform:translateX(-50%);font-size:30px;z-index:100"
    ></span>
    <el-carousel trigger="click" height="80vh" :autoplay="type" :initial-index='currentNum' v-if="changeDom">
      <el-carousel-item v-for="item in list_s">
        <div style="position:raletive;background: rgba(0, 0, 0, 0.5);">
          <img width="60%" height="100%" id="part_img" :src="item" alt />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: ["list", "num",'dom'],
  data() {
    return {
      type: true,
      list_s: this.list,
      currentNum: this.num,
      changeDom: this.dom,
    };
  },

  watch: {
    i(a, b) {
      console.log(a);
      this.index = a;
      if (a != b) {
        this.$forceUpdate();
      }
    }
  }
};
</script>

<style>
</style>