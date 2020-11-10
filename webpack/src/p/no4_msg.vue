<template>
  <div style="padding-bottom:10px;border-bottom: 1px solid #ccc">
    <el-row>
      <el-col :xs="24" :sm="18" :md="18" style="overflow: hidden;">
        <div class="item" style="padding-right:40px;position: relative;left:0">
          <div style="padding:20px 0">
            <slot name="title"></slot>
          </div>
          <div style="fong-size: 12px;color:#ccc;line-height:30px">
          <slot name="info"></slot>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="6" :md="6" style="overflow: hidden;float:right">
          <slot name="img"></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  
  data() {
    return {
      json: this.list
    };
  }
};
</script>

<style>
</style>