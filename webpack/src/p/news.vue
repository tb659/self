<template>
  <div class="slide" style="padding: 40px;">
    <slot name="img"></slot>
    <el-row style="position: raletive; overflow: hidden;">
      <el-col
        :xs="4"
        :sm="6"
        :md="6"
        class="date_wrap show"
        style="padding: 15px 0 0 10px;"
      >
        <span class="year" style="color: #aaaaaa; font-size: 12px;">2017</span>
        <span
          class="md post_date"
          style="color: #aaaaaa; font-size: 12px; display: block;"
          >06-01</span
        >
      </el-col>
      <el-col :xs="20" :sm="18" :md="18">
        <div
          class="title ellipsis"
          data-title="true"
          style="
            color: #444444;
            font-size: 16px;
            font-weight: normal;
            padding-top: 10px;
            padding-bottom: 10px;
          "
        >
          <slot name="new1"></slot>
        </div>
        <div
          class="description post_excerpt"
          style="
            color: #999999;
            font-size: 14px;
            max-width: px;
            word-break: break-all;
            line-height: 24px;
          "
        >
          <p>
            <slot name="new2"></slot>
          </p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {};
</script>

<style>
#index .slide {
  position: relative;
  z-index: 11;
}
#index .slide:after {
  content: "";
  display: block;
  width: 100%;
  height: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #f7f7f7;
  z-index: -10;
  transition: 0.35s;
}
#index .slide:hover:after {
  height: 100%;
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.1);
}
</style>
