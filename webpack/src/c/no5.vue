<template>
  <div id="no5">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:50px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>养殖基地</el-breadcrumb-item>
    </el-breadcrumb>

    <div id="item" style="text-align:center">
      <h2>
        <a>养殖基地</a>
      </h2>
      <p>BASE</p>
      <span></span>
    </div>
    <div style="padding: 0 50px;margin-bottom:100px">
      <el-row class="img" :gutter="40">
        <el-col :xs="12" :sm="8" :md="8" v-for="(i, $i) in list" style="margin-bottom:20px">
          <div>
            <el-button
              class="shadow"
              type="text"
              @click="dialogVisible = true"
              style="overflow:hidden;"
            >
              <img v-hover :src="i" alt style="width:100%;transition: .35s" @click="imgClick($i)" />
              <div class="shadow_s">pic({{$i+1}})</div>
            </el-button>
          </div>
        </el-col>
        <el-dialog :visible.sync="dialogVisible" width="100%" :before-close="handleClose">
          <div class="block">
            <span
              @click="type=!type"
              :class="type?'el-icon-video-pause':'el-icon-video-play'"
              style="position:absolute;left:50%;top:10%;transform:translateX(-50%);font-size:30px;z-index:100"
            ></span>
            <el-carousel
              trigger="click"
              height="80vh"
              :autoplay="type"
              :initial-index="currentNum"
              v-if="changeDom"
            >
              <el-carousel-item v-for="item in list">
                <div style="position:raletive;background: rgba(0, 0, 0, 0.5);">
                  <img width="60%" height="100%" id="part_img" :src="item" alt />
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          <!--  -->
        </el-dialog>
      </el-row>
    </div>
  </div>
</template>

<script>
// import lunbo from "./../p/lunbo.vue";
export default {
  // components: {
  //   lunbo
  // },
  methods: {
    handleClose(done) {
      done();
    },
    imgClick(index) {
      this.currentNum = index;
      this.changeDom = false;
      setTimeout(() => {
        this.changeDom = true;
      }, 0);
    }
  },
  directives: {
    hover(a) {
      a.style.transition = ".35s";
      (a.onmouseenter = function() {
        this.style.transform = "scale(1.2)";
      }),
        (a.onmouseleave = function() {
          this.style.transform = "scale(1)";
        });
    }
  },
  data() {
    return {
      type: true,
      currentNum: 0,
      changeDom: true,
      dialogVisible: false,
      list: [
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS82Njc4NjRjM2UyM2Q0OWI1YWIyNzk3NTIwY2FiNTEyNi00MDB4MzAwLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8xZThlZDg5MzM4ZGZiZjZmYTU1MmY0OWRlNGFmOWZiMi00MDB4MzAwLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS84ZDcyYzkwY2YzMDJkNmYwNmQyNzk2MWNiYjEwOWM5Ny00MDB4MzAwLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS85OWJmZjI0NWJmZWY1YzRmNWUxZmRhNzI1YzY2NGE0My00MDB4MzAwLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8xY2FkNmNhNzk0ZDg0MTllYTQ0ODhkMjYwZWNkN2Y0ZS00MDB4MzAwLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8xZmQ3YjI0NjlkMGJmYzNkODM1NDU2OTJkNzEzNDk2Yy00MDB4MzAwLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
      ]
    };
  }
};
</script>

<style>
#no5 img {
  display: block;
}
#no5 .shadow {
  position: relative;
  overflow: hidden;
}
#no5 .shadow_s {
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: -50px;
  padding-left: 20px;
  text-align: left;
  line-height: 50px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  transition: 0.35s;
}
#no5 .shadow:hover .shadow_s {
  bottom: 0;
}
#no5 .img span {
  overflow: hidden;
}
#no5 .img button {
  padding: 0;
}
#no5 #part_img {
  position: absolute;
  z-index: 20;
  left: 50%;
  top: 25%;
  transform: translateX(-50%);
}
#no5 .el-dialog {
  margin: 0;
  background: #333;
}
#no5 .el-dialog__header {
  position: absolute;
  z-index: 100;
  right: 20px;
}
#no5 .el-dialog {
  margin-top: 0 !important;
}
#no5 .el-dialog__body {
  padding: 0;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  height: 100vh;
  background-color: #333 !important;
}
#no5 .el-carousel__item:nth-child(2n),
#no5 .el-carousel__item:nth-child(2n + 1) {
  background-color: #333 !important;
}
#no5 a {
  color: #333;
}
#no5 h2 a {
  padding-top: 30px;
  display: block;
}
#no5 #item {
  padding: 30px;
}
#no5 #item h2 {
  font-weight: normal;
  line-height: 60px;
}
#no5 #item p {
  font-weight: normal;
  color: #ccc;
}
#no5 #item span {
  width: 40px;
  height: 2px;
  display: inline-block;
  background: #000;
}

#no5 {
  padding: 0 50px;
}
</style>