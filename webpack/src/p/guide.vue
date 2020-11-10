<template>
  <div style="background:#eee">
      <el-row>
        <el-col :xs="24" :sm="8" :md="8" style="padding:0;overflow:hidden">
          <slot name="img"></slot>
        </el-col>
        <el-col :xs="24" :sm="16" :md="16" style="padding:10px 30px;">
          <div style="line-height:40px">
            <slot name="title"></slot>
          </div>
          <div style="color:#999">
            <slot name="cont"></slot>
          </div>
        </el-col>
      </el-row>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>